import React, { Component } from "React"
import { fetchFeedPage } from '../store/index'
import { connect } from "react-redux";

class Feed extends Component{

    constructor(props){
        super(props)
        this.state = {
            stories: (this.props.feed_data? this.props.feed_data : [])
        }
    }

    componentDidMount(){

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
                    stories.hits.map((story)=>{
                        return (
                            <tr>
                                <td>{story.num_comments}</td>
                                <td>{story.points}</td>
                                <td>Vote</td>
                                <td>{story.title}</td>
                            </tr>
                        )
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

