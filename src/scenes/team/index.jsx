import { Box, Typography, useTheme, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Header from "../../components/Header";
import { useState } from "react";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open , setOpen] = useState(false)
  const [previewOpen , setPreviewOpen] = useState(false)

  const handleClickOpen = ()=> {
    setOpen(true)
  }

  const handleClickClose = ()=> {
    setOpen(false)
  }

  const handlePreviewOpen = ()=> {
    setPreviewOpen(true)
  }

  const handlePreviewClose = ()=> {
    setPreviewOpen(false)
  }

  const handleSubmit = (event)=> {
    event.preventDefault()

    handleClickClose()
  }



  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "feeStatus",
      headerName: "Fee Status",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.7
    },
    {
      field: "rollNumber",
      headerName: "Roll Number",
      flex: 0.7,
    },
    {
      field: "course",
      headerName: "Course",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1.3,
      renderCell: ({ row: { accessUpdate , accessDelete} }) => {
        return (
          <>    
          <Box 
          m="0 10px 0 0">
            <span onClick={handlePreviewOpen}> <VisibilityOutlinedIcon /> </span>
            </Box>  
          <Box
            width="50%"
            mr="7px"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              accessUpdate === "update" &&  colors.greenAccent[700]
            }
            borderRadius="4px"
            >
            { accessUpdate === "update" && <EditOutlinedIcon />}
            < Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {accessUpdate}
            </Typography>
          </Box>

          <Box
            width="50%"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              accessDelete === "delete" && colors.greenAccent[600]
            }
            borderRadius="4px"
            >
            {accessDelete === "delete" && <DeleteOutlineOutlinedIcon />}

            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {accessDelete}
            </Typography>
          </Box>
            </>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="APPLICANTS" subtitle="Managing the Applicant's" />

    <Button
      sx={{
        backgroundColor: colors.blueAccent[700],
        color: colors.grey[100],
        fontSize: "14px",
        fontWeight: "bold",
        padding: "10px 20px",
        float: "right"
      }}
      onClick={handleClickOpen}
      >
      <PersonOutlinedIcon sx={{ mr: "10px" }} />
      Add A Applicant
    </Button>
  </Box>

<Dialog open={open} onClose={handleClickClose}>
<DialogTitle>Add An Applicant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details of the new applicant.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="fullname"
              label="FullName"
              type="text"
              
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="cnic"
              label="Cnic Number"
              type="number"
              
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              
              variant="outlined"
              required
            />
               <TextField
              margin="dense"
              id="phone"
              label="Phone Number"
              type="number"
              
              variant="outlined"
              required
            />
               <TextField
              margin="dense"
              id="address"
              label="Address"
              type="text"
              
              variant="outlined"
              required
            />
               <TextField
              margin="dense"
              id="qualification"
              label="Qualification"
              type="text"
              
              variant="outlined"
              required
            />
                    <TextField
              margin="dense"
              id="gender"
              label="Gender"
              type="text"
              
              variant="outlined"
              required
            />
                    <TextField
              margin="dense"
              id="dateOfBirth"
              label="Date Of Birth"
              type="text
              
              
              "
              
              variant="outlined"
              required
            />
                    <TextField
              margin="dense"
              id="course"
              label="Course"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
            <DialogActions>
              <Button onClick={handleClickClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add Applicant
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onClose={handlePreviewClose}>
<DialogTitle>Applicant Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Applicant Complete Details
          </DialogContentText>
            <h4>Name</h4>
            <h2>Syed Iqran</h2>
            <DialogActions>
              <Button onClick={handlePreviewClose} color="primary">
                Close
              </Button>
            </DialogActions>
        </DialogContent>
      </Dialog>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
