import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMatch } from "react-router-dom";
import commentApi from "../../../../api/commentApi";
import { useSelector } from "react-redux";
import { userid } from "../../../../app/Selectors";
import useComments from "../../../../hooks/useComments";

// Define the Coment component
Coment.propTypes = {
  onSubmit: PropTypes.func,
  commentsData: PropTypes.array,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Comment = ({ comment, handleReplyComment, handleDeleteComment }) => {
  const userId = useSelector(userid); // Get logged-in user's ID

  return (
    <Paper elevation={1} style={{ padding: "16px", marginBottom: "8px" }}>
      <Typography variant="body1">
        <strong>{comment.author}</strong>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {comment.date}
      </Typography>
      <Typography variant="body1" style={{ marginTop: "8px" }}>
        {comment.content}
      </Typography>
      <Button
        style={{ marginTop: "8px" }}
        onClick={() => handleReplyComment(comment.author, comment.id)}
      >
        Trả lời
      </Button>
      
      {/* Conditionally render delete button */}
      {userId === comment.userId && (
        <Button
          style={{ marginTop: "8px" }}
          onClick={() => handleDeleteComment(comment.id)} // Trigger delete action
        >
          Xóa
        </Button>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <Box marginTop={2}>
          {comment.replies.map((reply, index) => (
            <Comment
              key={index}
              comment={reply}
              handleReplyComment={handleReplyComment}
              handleDeleteComment={handleDeleteComment} // Pass down delete handler to replies
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};


// Main component function
function Coment({ data }) {
  const match = useMatch("/products/:productId");
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [question, setQuestion] = useState("");
  const [question1, setQuestion1] = useState("");
  const [error, setError] = useState("");
  const [error1, setError1] = useState("");
  const userId = useSelector(userid); // Get user ID from state
  const userInfo = useSelector((state) => state.user.userInfo); // Get user info from state (for name)
  const [commentsData, setCommentsData] = useState(data);
  const [parentId, setParentId] = useState();
  const { params: { productId } } = match;

  const handleClose = () => setOpen(false);
  console.log(userInfo);
  const handleReplyComment = (author, id) => {
    setOpen(true);
    setAuthor(author);
    setParentId(id);
  };

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
    if (event.target.value) {
      setError("");
    }
  };

  const handleInputChange1 = (event) => {
    setQuestion1(event.target.value);
    if (event.target.value) {
      setError1("");
    }
  };

  // Submit comment
  const handleSubmitComment = async () => {
    if (!question.trim()) {
      setError("Câu hỏi không được để trống");
      return;
    }
    if (userId == null) {
      setError("Yêu cầu đăng nhập");
      return;
    }
    const commentData = {
      content: question,
      productId: productId,
      parentCommentId: "",
      userId: userId,
      author: userInfo ? userInfo.fullName : "Unknown Author", // Set author's name dynamically
    };

    try {
      const res = await commentApi.createComment(commentData);
      if (res.status === "success") {
        try {
          const res = await commentApi.getComments(productId);
          setCommentsData(res);
          setQuestion("");
        } catch (error) {
          console.log("Loi lay ds comments", error);
        }
      } else {
        alert("Comment thất bại: " + res.message);
      }
    } catch (error) {
      console.log("Lỗi đăng ký: ", error);
      alert("Đã xảy ra lỗi trong quá trình đăng ký");
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        // Assuming you have a deleteComment API method
        const res = await commentApi.deleteComment(commentId);

          setCommentsData((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
      } catch (error) {
        console.log("Lỗi xóa bình luận:", error);
        alert("Đã xảy ra lỗi trong quá trình xóa bình luận");
      }
    }
  };
  
  // Submit reply comment
  const handleSubmitReplyComment = async () => {
    if (!question1.trim()) {
      setError1("Câu hỏi không được để trống");
      return;
    }
    if (userId == null) {
      setError1("Yêu cầu đăng nhập");
      return;
    }
    const replyCommentData = {
      content: question1,
      productId: productId,
      parentCommentId: parentId,
      userId: userId,
      author: userInfo ? userInfo.fullName : "Unknown Author", // Set author's name dynamically for replies
    };

    try {
      const res = await commentApi.replyComment(parentId, replyCommentData);
      if (res.status === "success") {
        try {
          const res = await commentApi.getComments(productId);
          setCommentsData(res);
          setOpen(false);
          setQuestion1("");
        } catch (error) {
          console.log("Loi lay ds comments", error);
        }
      } else {
        alert("Comment thất bại: " + res.message);
      }
    } catch (error) {
      console.log("Lỗi đăng ký: ", error);
      alert("Đã xảy ra lỗi trong quá trình đăng ký");
    }
  };

  return (
    <Box padding="24px 0px">
      <Box>
        {commentsData &&
          commentsData.map((comment, index) => (
            <Comment
            key={index}
            comment={comment}
            handleReplyComment={handleReplyComment}
            handleDeleteComment={handleDeleteComment} // Pass down delete handler
          />
          ))}
        <Box marginTop={2}>
          <TextField
            label="Viết đánh giá của bạn"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={question}
            onChange={handleInputChange}
            error={!!error}
            helperText={error}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "8px" }}
            onClick={handleSubmitComment}
          >
            Gửi đánh giá
          </Button>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box marginTop={2}>
            <Typography>Trả lời "{author}"</Typography>
            <TextField
              label="Viết câu hỏi của bạn"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={question1}
              onChange={handleInputChange1}
              error={!!error1}
              helperText={error1}
              sx={{ marginTop: '5px' }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "8px" }}
              onClick={handleSubmitReplyComment}
            >
              Gửi câu hỏi
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Coment;
