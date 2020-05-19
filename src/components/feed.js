import React, { Component } from "react"
import { fetchFeedPage } from '../store/index'
import { connect } from "react-redux";
import queryString from 'query-string';
import { fetchFeed } from '../api'

class Feed extends Component{

    constructor(props){
        super(props)
        this.state = {
            stories: (this.props.feed_data? this.props.feed_data : []),
            localData: {},
            pgIndex: 0,
            loading: false,
        }
        this.upvoteStory = this.upvoteStory.bind(this)
        this.hideStory = this.hideStory.bind(this)
    }

    componentDidMount(){
        //window.localStorage.removeItem("upvotes");
        let page = 0
        const queryValues = queryString.parse(this.props.location.search);
        if(Object.prototype.hasOwnProperty.call(queryValues, 'page')){
            page = parseInt(queryValues.page)
            if(isNaN(page)){
                page = 0
            }
        }
        let { stories } = this.state
        let localData = window.localStorage.getItem("userUpvotesHides") || {}
        if(typeof localData === 'string'){
            localData= JSON.parse(localData)
            stories.hits.map((story, index) => {
                if(localData.hasOwnProperty(story.objectID)){
                    if(localData[story.objectID].hide){
                        stories.hits[index].hidden = true
                    }
                    if(localData[story.objectID].upvote > stories.hits[index].points){
                        stories.hits[index].points = localData[story.objectID].upvote
                    }
                    else{
                        localData[story.objectID].upvote = stories.hits[index].points
                        localStorage.setItem("userUpvotesHides", JSON.stringify(localData))
                    }
                }
            })
            this.setState({
                localData: localData,
                stories: stories,
                pgIndex: page
            })
        }
        console.log('stories',stories)
    }

    componentDidUpdate(){
        let page = 0, that= this
        const queryValues = queryString.parse(this.props.location.search);
        if(Object.prototype.hasOwnProperty.call(queryValues, 'page')){
            page = parseInt(queryValues.page)
            if(isNaN(page)){
                page = 0
            }
        }
        if(this.state.pgIndex != page){
            this.setState({
                loading: true,
                pgIndex: page,
            })
            fetchFeed(page)
            .then((response) => {
                console.log('response',response)
                this.setState({
                    stories: response,
                })
            })
            .catch((error) => {
                console.log('error',error)
            })
            .finally(() => {
                this.setState({loading: false})
            })

        }
    }

    upvoteStory(id, index){
        let { localData, stories } = this.state
        if(localData.hasOwnProperty(id)){
            let item = localData[id]
            item["upvote"] += 1
        }
        else{
            localData[id] = {
                hide: false
            }
            localData[id]["upvote"] = (stories.hits[index].points + 1)
        }
        stories.hits[index].points = localData[id]["upvote"]
        this.setState({
            localData: localData,
            stories: stories
        })
        localStorage.setItem("userUpvotesHides", JSON.stringify(localData))
    }

    hideStory(id, index){
        let { localData, stories } = this.state
        if(localData.hasOwnProperty(id)){
            let item = localData[id]
            item["hide"] = true
        }
        else{
            localData[id] = {
                "upvote": (stories.hits[index].points + 1),
                "hide": true
            }
        }
        stories.hits[index].hidden = true
        this.setState({
            localData: localData,
            stories: stories
        })
        localStorage.setItem("userUpvotesHides", JSON.stringify(localData))
    }

    prev(){
        let { pgIndex } = this.state
        pgIndex = pgIndex - 1
        this.props.history.push('/?page=' + pgIndex)
    }

    next(){
        let { pgIndex } = this.state
        pgIndex = pgIndex + 1
        this.props.history.push('/?page=' + pgIndex)
    }

    render(){
        let { stories, pgIndex, loading } = this.state
        return(
            <div>
                <p>testing it out</p>
                <table class="feed_table">
                    <tr class="orangeBG">
                        <th>Comments</th>
                        <th align="center">Vote Count</th>
                        <th>UpVote</th>
                        <th colspan="5" align="left">News Details</th>
                    </tr>
                    {
                        stories.hits.map((story,index)=>{
                            if(!story.hasOwnProperty("hidden")){
                                return (
                                    <tr class={index%2==0 ? "color_e0e0e0" : ""}>
                                        <td>{story.num_comments}</td>
                                        <td>{story.points}</td>
                                        <td><button onClick={() => this.upvoteStory(story.objectID,index)}>Vote</button></td>
                                        <td>{story.title} by {story.author} [<a onClick={() => this.hideStory(story.objectID,index)}>hide</a>]</td>
                                    </tr>
                                )
                            }
                        })
                    }
                </table>
                {loading ? 
                    ''
                    :
                    <p>
                        <a onClick={pgIndex == 0 ? () => {} : this.prev.bind(this)}>Prev</a>
                        <span> | </span>
                        <a onClick={pgIndex == (stories.nbPages - 1) ? () => {} : this.next.bind(this)}>Next</a>
                    </p>
                }
            </div>
        )
    }


}

Feed.serverFetch = fetchFeedPage;

const mapStateToProps = state => ({
    feed_data : state.feed_data
});

const mapDispatchToProps = {
    fetchFeedPage,
};

export default connect(mapStateToProps,mapDispatchToProps)(Feed);

