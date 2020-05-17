const initialState = {}

const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_FEED_DATA": 
          return {
              feed_data: action.res
          };
        default:
            return state
    }
}

export default rootReducer