import React from "react";

import { CircularProgress, Typography, IconButton, DialogActions, DialogContent, Dialog, styled, Button} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

export default function PredictModal({ open, setOpen, loading, result }) {
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        maxWidth={"md"}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>

        <br />
        <br />
        <br />
        <DialogContent>
          <Typography gutterBottom>
            {loading ? (
              <span>
                <br /> <br />
                <CircularProgress size={40} />
              </span>
            ) : result == "Error" ? (
              <div
                style={{ color: "red", fontSize: "24px", padding: "20px 0" }}
              >
                Something Went Wrong
              </div>
            ) : result ? (
              <div style={{ fontSize: "24px", padding: "0px 20px" }}>
                The food is <span style={{ color: "green" }}>{result}</span>
              </div>
            ) : (
              ""
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
