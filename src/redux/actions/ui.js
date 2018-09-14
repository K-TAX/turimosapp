export const toggleDrawer = ()=>{
    return (dispatch) => {
        dispatch({
            type : "TOGGLE_DRAWER"
        })
    }
}
export const changeTitle = (title)=>{
    return (dispatch) => {
        dispatch({
            type : "CHANGE_TITLE",
            payload : {
                title
            }
        })
    }
}
