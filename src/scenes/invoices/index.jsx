import { Box, Typography, useTheme, Button , Dialog , DialogContent , DialogContentText , DialogActions , DialogTitle , TextField} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {useState , useEffect} from 'react'

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [applicantData , setApplicantData] = useState([])
  const [selectedApplicant,setSelectedApplicant] = useState([])

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch( 'http://localhost:3005/admin/get-all-applicants');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const dataWithIds = data.map((applicant, index) => ({
          id:  index, 
          applicantName: applicant.fullname,
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

  const handleUpdateModalOpen = async (applicant) => {
    try {
      const response = await fetch(`
        http://localhost:3005/admin/get-applicant-by-rollno/${applicant.rollNumber}
        `);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSelectedApplicant(data);
      console.log("Applicant Details", selectedApplicant)
      setUpdateModalOpen(true);
    } catch (error) {
      console.error('Error fetching applicant details:', error);
    }
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false)
  }

 const handleUpdateFeeStatus = async (event) => {
    event.preventDefault();
    console.log("selected applicants details " , selectedApplicant)
    const updatedApplicant = {
      rollNumber: selectedApplicant.rollNo,
      feeStatus: selectedApplicant.feeStatus
    };

    console.log("Updating applicant with data:", updatedApplicant);
  
    try {
      const response = await fetch(`http://localhost:3005/admin/update-applicant-by-cnic`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedApplicant)
      });

      const data = await response.json();  // Attempt to parse the JSON response

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update applicant');  // Use backend's error message if available
      }

      console.log('Updated applicant:', data);
      
      // Optionally, refresh the list of applicants or update the state
      setUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating applicant:', error.message || error);
    }
  };



  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "applicantName",
      headerName: "Applicant Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "rollNumber",
      headerName: "Roll Number",
      flex: 1,
    },
    {
      field: "course",
      headerName: "Course",
      flex: 1,
    },
    {
      field: "feeStatus",
      headerName: "Fee Status",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          {params.row.feeStatus}
        </Typography>
      ),
    },
    {
      field: "access level",
      headerName: "Access Level",
      flex: 1,
      renderCell: (params) => {
        const feeStatus = params.row
          return (
            <>
              <Box
                width="60%"
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
                onClick={() => handleUpdateModalOpen(feeStatus)}
                >
                <EditOutlinedIcon sx={{ mr: "5px" }}/>
                  Update
                </ Button>
              </Box>
            </>
          );
        },
      },
  ];

  return (
    <Box m="20px">
      <Header title="FEE STATUS" subtitle="Managing the Applicant's Fee Status" />

      <Dialog open={updateModalOpen} onClose={handleUpdateModalClose}>
        <DialogTitle>Update a Fee Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the Details to update the fee status
          </DialogContentText>
          <form onSubmit={handleUpdateFeeStatus}>
            <TextField
              autoFocus
              margin="dense"
              id="rollNumber"
              label="Roll Number"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedApplicant.rollNumber}
              required
            />
             <TextField
              autoFocus
              margin="dense"
              id="feeStatus"
              label="Fee Status"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedApplicant.feeStatus}
              onChange={(e) => setSelectedApplicant({ ...selectedApplicant, feeStatus: e.target.value })}
              required
            />
            <DialogActions>
              <Button onClick={handleUpdateModalClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                Update Fee Status
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

export default Invoices;
