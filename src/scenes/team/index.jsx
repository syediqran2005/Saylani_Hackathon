import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Container,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
// import { mockDataTeam } from "../../data/mockData";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Header from "../../components/Header";
import ImageInput from "./imageInput";
import { useEffect, useState } from "react";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [applicantData , setApplicantData] = useState([])
  const [UpdateApplicantData,setUpdateApplicantData] = useState([])

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch( 'http://localhost:3006/admin/get-all-applicants');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const dataWithIds = data.map((applicant, index) => ({
          id:  index, 
          name: applicant.fullname,
          feeStatus: applicant.feeStatus,
          course: applicant.course,
          rollNumber: applicant.rollNo,
        }));
        setApplicantData(dataWithIds);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        }
    };
    fetchApplicants();
  }, []);

  console.log("applicants data :" , applicantData)
  
  const handleImageChange = (file) => {
    console.log("Selected file:", file);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const handleUpdateModalOpen = (rollno) => {
    setUpdateModalOpen(true)

    const getApplicantDetails = async (rollNo) => {
      try{
        const responseUpdateApplicantData = await fetch(
          ` http://localhost:3006/admin/get-applicant-by-rollno/${rollNo} `
        );
        const updateApplicantData = await responseUpdateApplicantData.json()
        setUpdateApplicantData(updateApplicantData) 
      } catch (error) {
        console.log("error", error);
      }
    }
  getApplicantDetails()
  }
  console.log("applicant Details for update", UpdateApplicantData)
  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false)
  }

  const handleUpdateApplicant = () => {
  console.log("i am working")

  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formValues = {
      fullname: event.target[0].value,
      cnic: event.target[2].value,
      email: event.target[4].value,
      phone: event.target[6].value,
      address: event.target[8].value,
      qualification: event.target[10].value,
      gender: event.target[12].value,
      dateOfBirth: event.target[14].value,
      course: event.target[16].value,
      profileImg: event.target[18].value
    };

    await fetch("http://localhost:3006/admin/create-applicant", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: formValues.fullname,
        cnic: formValues.cnic,
        email: formValues.email,
        contact: formValues.phone,
        address: formValues.address,
        qualification: formValues.qualification,
        gender: formValues.gender,
        dateOfBirth: formValues.dateOfBirth,
        course: formValues.course,
        profileImg: formValues.profileImg
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("uploaded", data);
      })
      .catch((error) => {
        console.log("error", error);
      });

    console.log("event", event);
    console.log("Form Values", formValues);
    handleClickClose();
  };


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
      flex: 0.7,
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
      renderCell: ({ row: { accessUpdate, accessDelete } }) => {
        return (
          <>
            <Box m="0 10px 0 0">
              <span onClick={handlePreviewOpen}>
                {" "}
                <VisibilityOutlinedIcon />{" "}
              </span>
            </Box>
            <Box
              width="50%"
              mr="7px"
              p="5px"
              display="flex"
              justifyContent="center"
              backgroundColor={colors.greenAccent[600]}
              borderRadius="4px" 
              >
              <Button sx={{ 
                ml: "5px", 
                color: colors.grey[100],
                fontSize: "14px",
            padding: "5px 10px",
              }} 
              onClick={handleUpdateModalOpen}
              >
              <EditOutlinedIcon sx={{ mr: "5px" }}/>
                Update
              </ Button>
            </Box>

            <Box
              width="50%"
              p="5px"
              display="flex"
              justifyContent="center"
              backgroundColor={colors.greenAccent[600]}
              borderRadius="4px"
            >

              <Button sx={{ 
                ml: "5px", 
                color: colors.grey[100],
                fontSize: "14px",
            padding: "5px 10px",
              }}>
                <DeleteOutlineOutlinedIcon sx={{ mr: "5px" }}/>
                Delete
              </Button>
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
            float: "right",
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
              sx={{ width: "48%", marginRight: "10px" }}
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="cnic"
              label="Cnic Number"
              type="number"
              sx={{ width: "48%" }}
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              sx={{ width: "48%", marginRight: "10px" }}
              mr="5px"
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="phone"
              label="Phone Number"
              type="number"
              sx={{ width: "48%" }}
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="address"
              label="Address"
              type="text"
              sx={{ width: "48%", marginRight: "10px" }}
              mr="5px"
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="qualification"
              label="Qualification"
              type="text"
              sx={{ width: "48%" }}
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="gender"
              label="Gender"
              type="text"
              sx={{ width: "48%", marginRight: "10px" }}
              mr="5px"
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="dateOfBirth"
              label="Date Of Birth"
              type="text"
              sx={{ width: "48%" }}
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
            <Container>
              <Typography variant="h4" gutterBottom>
                Upload an Image
              </Typography>
              <ImageInput onImageChange={handleImageChange} />
            </Container>

            <DialogActions>
              <Button onClick={handleClickClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                Add Applicant
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onClose={handlePreviewClose}>
        <DialogTitle>Applicant Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Applicant Complete Details</DialogContentText>
          <h4>Name</h4>
          <h2>Syed Iqran</h2>
          <DialogActions>
            <Button onClick={handlePreviewClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={updateModalOpen} onClose={handleUpdateModalClose}>
        <DialogTitle>Update An Applicant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the Details to update the applicants data.
          </DialogContentText>
          <form onSubmit={handleUpdateApplicant}>
            <TextField
              autoFocus
              margin="dense"
              id="fullname"
              label="FullName"
              type="text"
              sx={{ width: "48%", marginRight: "10px" }}
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="cnic"
              label="Cnic Number"
              type="number"
              sx={{ width: "48%" }}
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              sx={{ width: "48%", marginRight: "10px" }}
              mr="5px"
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="phone"
              label="Phone Number"
              type="number"
              sx={{ width: "48%" }}
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="address"
              label="Address"
              type="text"
              sx={{ width: "48%", marginRight: "10px" }}
              mr="5px"
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="qualification"
              label="Qualification"
              type="text"
              sx={{ width: "48%" }}
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="gender"
              label="Gender"
              type="text"
              sx={{ width: "48%", marginRight: "10px" }}
              mr="5px"
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="dateOfBirth"
              label="Date Of Birth"
              type="text"
              sx={{ width: "48%" }}
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
            <Container>
              <Typography variant="h4" gutterBottom>
                Upload an Image
              </Typography>
              <ImageInput onImageChange={handleImageChange} />
            </Container>

            <DialogActions>
              <Button onClick={handleUpdateModalClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                Add Applicant
              </Button>
            </DialogActions>
          </form>
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
        <DataGrid checkboxSelection rows={applicantData} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team
