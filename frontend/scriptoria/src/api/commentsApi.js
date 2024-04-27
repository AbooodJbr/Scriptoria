import axios from 'axios'

const sendComment = async (comment, token) => {
    try {
        await axios({
            url: "http://localhost:5000/comments",
            method: "POST",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + token,
            },
            data: comment
        });
    } catch (error) {
        console.log(error);
    }
}

const getComments = async (storyId) =>{
    try {
        const response = await axios({
            url: "http://localhost:5000/comments/" + storyId,
            method: "GET",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                storyId
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

const editComment = async (comment, token) =>{
    try {
        await axios({
            url : "http://localhost:5000/comments/" + comment._id,
            method : "PATCH",
            withCredentials: true,
            headers : {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + token,
            },
            data : comment 
        })
    } catch(error){
        console.log(error)
    }
}

const deleteComment = async (id, token) => {
    try {
        const response = await axios({
            url: "http://localhost:5000/comments/" + id,
            method: "DELETE",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + token,
            },
        });
        return response.data;
    } catch (error) {
        console.error("error :", error);
        throw error;
    }
};

export {
    getComments,
    sendComment,
    deleteComment,
    editComment
}