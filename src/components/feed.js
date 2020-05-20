/* eslint-disable react/jsx-no-comment-textnodes */
import React, { Component } from "react"
import { fetchFeedPage } from '../store/index'
import { connect } from "react-redux";
import queryString from 'query-string';
import { fetchFeed } from '../api'
import Graph from './graph'
import timeDifference from '../utils'

class Feed extends Component{

    constructor(props){
        super(props)
        this.state = {
            stories: (this.props.feed_data? this.props.feed_data : {hits:[]}),  // save data from store into state
            localData: {},
            pgIndex: 0,
            loading: false,
            graphX:[],
            graphY:[],
        }
        this.upvoteStory = this.upvoteStory.bind(this)
        this.hideStory = this.hideStory.bind(this)
    }

    componentDidMount(){
        //set page number count
        let page = 0
        const queryValues = queryString.parse(this.props.location.search);
        if(Object.prototype.hasOwnProperty.call(queryValues, 'page')){
            page = parseInt(queryValues.page)
            if(isNaN(page)){
                page = 0
            }
        }
        //get data from local storage and check for hiding and upvoting stories from local storage
        let { stories, graphX, graphY } = this.state
        console.log('stories',this.state.stories,stories.hits.length)
        let localData = window.localStorage.getItem("userUpvotesHides") || {}
        let removeIndex = []
        //if there is some data in local storage
        if(typeof localData === 'string'){
            localData= JSON.parse(localData)
            stories.hits.map((story, index) => {
                graphX.push(story.objectID)
                graphY.push(story.points)
                if(story.objectID=="15800676"){
                    console.log('graphy1',graphY[graphY.length - 1])
                }
                if(localData.hasOwnProperty(story.objectID)){
                    if(localData[story.objectID].upvote > stories.hits[index].points){
                        stories.hits[index].points = localData[story.objectID].upvote
                        graphY[graphY.length - 1] = localData[story.objectID].upvote
                        if(story.objectID=="15800676"){
                            console.log('graphy2',graphY[graphY.length - 1])
                        }
                    }
                    else{
                        localData[story.objectID].upvote = stories.hits[index].points
                        localStorage.setItem("userUpvotesHides", JSON.stringify(localData))
                    }
                    if(localData[story.objectID].hide){
                        graphX.pop()
                        graphY.pop()
                        removeIndex.push(index)
                        stories.hits[index].hidden = true
                    }
                }
            })
            removeIndex.map((index) => stories.hits.splice(index,1))
            console.log('graph0',graphX,graphY,stories,stories.hits.length,localData)
        }
        else{   //there is no data in local storage, continue with getting data for graphs x-axis and y-axis
            stories.hits.map((story, index) => {
                graphX.push(story.objectID)
                graphY.push(story.points)
            }) 
        }
        this.setState({
            localData: localData,
            stories: stories,
            pgIndex: page,
            graphX: graphX,
            graphY: graphY
        })
    }

    componentDidUpdate(){
        let page = 0
        const queryValues = queryString.parse(this.props.location.search);
        if(Object.prototype.hasOwnProperty.call(queryValues, 'page')){
            page = parseInt(queryValues.page)
            if(isNaN(page)){
                page = 0
            }
        }
        //run only if the page number is changes
        if(this.state.pgIndex !== page){
            this.setState({
                loading: true,
                pgIndex: page,
                graphY: [],
                graphX: []
            })
            //fetch stories for new page using api
            fetchFeed(page)
            .then((response) => {
                let graphX=[],graphY=[]
                let { localData } = this.state
                response.hits.map((story, index) => {
                    graphX.push(story.objectID)
                    graphY.push(story.points)
                    //check for hidden stories and upvotes if there are any in localstorage
                    if(localData.hasOwnProperty(story.objectID)){
                        if(localData[story.objectID].hide){
                            graphX.pop()
                            graphY.pop()
                            response.hits[index].hidden = true
                        }
                        if(localData[story.objectID].upvote > response.hits[index].points){
                            response.hits[index].points = localData[story.objectID].upvote
                        }
                        else{
                            localData[story.objectID].upvote = response.hits[index].points
                            localStorage.setItem("userUpvotesHides", JSON.stringify(localData))
                        }
                    }
                })
                this.setState({
                    localData: localData,
                    stories: response,
                    graphY: graphY,
                    graphX: graphX
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
        let { localData, stories, graphY, graphX } = this.state
        //update localstorage value if upvote exists in local storage
        if(localData.hasOwnProperty(id)){
            let item = localData[id]
            item["upvote"] += 1
        }
        else{       //create it in local storage if it does not exist using story objectId as key and save hide and upvote properties
            localData[id] = {
                hide: false
            }
            localData[id]["upvote"] = (stories.hits[index].points + 1)
        }
        console.log('upvote',stories.hits[index].points,localData[id]["upvote"],index)
        stories.hits[index].points = localData[id]["upvote"]
        console.log('upvote1',index,graphY,graphY[index])
        graphY[index] = stories.hits[index].points
        console.log('upvote2',index,graphY[index])
        this.setState({
            localData: localData,
            stories: stories,
            graphY: graphY
        })
        localStorage.setItem("userUpvotesHides", JSON.stringify(localData))
    }

    hideStory(id, index){
        let { localData, stories, graphY, graphX } = this.state
        //update localstorage value if hide exists for this story in local storage
        if(localData.hasOwnProperty(id)){
            let item = localData[id]
            item["hide"] = true
        }
        else{   //create it in local storage if it does not exist using story objectId as key and save hide and upvote properties
            localData[id] = {
                "upvote": (stories.hits[index].points + 1),
                "hide": true
            }
        }
        graphX.splice(index,1)
        graphY.splice(index,1)
        stories.hits[index].hidden = true
        stories.hits.splice(index,1)
        this.setState({
            localData: localData,
            stories: stories,
            graphX: graphX,
            graphY: graphY
        })
        localStorage.setItem("userUpvotesHides", JSON.stringify(localData))
    }

    prev(){
        let { pgIndex } = this.state
        pgIndex = pgIndex - 1
        this.props.history.push('/?page=' + pgIndex)    //update url
    }

    next(){
        let { pgIndex } = this.state
        pgIndex = pgIndex + 1
        this.props.history.push('/?page=' + pgIndex)    //update url
    }

    render(){
        let { stories, pgIndex, loading, graphX, graphY } = this.state
        let currentTime = new Date()
        return(
            <div class="container">
                <table class="feed_table">
                    <tr class="orangeBG">
                        <th align="left">Comments</th>
                        <th align="left">Vote Count</th>
                        <th align="left">UpVote</th>
                        <th colspan="5" align="left">News Details</th>
                    </tr>
                    {
                        // eslint-disable-next-line array-callback-return
                        stories.hits.map((story,index) => {
                            if(!story.hasOwnProperty("hidden")){
                                let url = (story.url == null ? story.story_url: story.url)
                                return (
                                    <tr class={index%2===0 ? "color_e0e0e0" : ""}>
                                        <td>{story.num_comments}</td>
                                        <td>{story.points}</td>
                                        <td><a onClick={() => this.upvoteStory(story.objectID,index)}>▲</a></td>
                                        <td>
                                            <a class="anchor_no_underline" href={url}>{story.title}</a>
                                            {url == null ? '' : (<span class="grey">( {(url.split("/")[2]).substring(4)} ) </span> ) }
                                            <span class="grey"> by </span>
                                            <span>{story.author}</span>
                                            <span class="grey"> {timeDifference(currentTime, new Date(story.created_at))} </span>
                                            [<a onClick={() => this.hideStory(story.objectID,index)} class="hide">hide</a>]
                                        </td>
                                    </tr>
                                )
                            }
                        })
                    }
                </table>
                {loading ? 
                    ''
                    :
                    <p class="next_prev_btn">
                        <a onClick={pgIndex === 0 ? () => {} : this.prev.bind(this)}>Prev</a>
                        <span> | </span>
                        <a onClick={pgIndex === (stories.nbPages - 1) ? () => {} : this.next.bind(this)}>Next</a>
                    </p>
                }
                <hr class="orange_hr"/>
                {
                    (graphX.length > 0 && graphY.length > 0) ?
                        <Graph xValues={graphX} yValues={graphY}/>
                    :
                        ""
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

