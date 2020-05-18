import React, { Component } from "react"
import { fetchFeedPage } from '../store/index'
import { connect } from "react-redux";

class Feed extends Component{

    constructor(props){
        super(props)
        this.state = {
            stories: (this.props.feed_data? this.props.feed_data : []),
            localData: {},
        }
        this.upvoteStory = this.upvoteStory.bind(this)
        this.hideStory = this.hideStory.bind(this)
    }

    componentDidMount(){
        //window.localStorage.removeItem("upvotes");
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
                stories: stories
            })
        }
        console.log('stories',stories)
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

    render(){
        let { stories } = this.state
        return(
            <table>
                <tr>
                    <th>Comments</th>
                    <th>Vote Count</th>
                    <th>UpVote</th>
                    <th colspan="5">News Details</th>
                </tr>
                {
                    stories.hits.map((story,index)=>{
                        if(!story.hasOwnProperty("hidden")){
                            return (
                                <tr>
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

