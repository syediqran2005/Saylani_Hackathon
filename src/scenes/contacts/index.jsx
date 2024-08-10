import { Box , Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {useState , useEffect} from 'react'

const Courses = () => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [coursesData, setCoursesData] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:3005/admin/get-all-courses');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            // Log the data to inspect its structure
            console.log("Fetched data:", data);

            // Check if data is an array before mapping
            if (Array.isArray(data)) {
                const dataWithIds = data.map((course) => ({
                    id: course._id, 
                    courseName: course.courseName,
                    testFormUrl: course.testFormUrl,
                    applicantsEnrolled: course.applicant ? course.applicant.length : 0,  // Check for the existence of applicant
                }));
                setCoursesData(dataWithIds);
            } else {
                console.error('Expected an array but received:', data);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    };
    fetchCourses();
}, []);
  console.log("course data " , coursesData)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const handleUpdateModalOpen = async (course) => {
    setSelectedCourse(course);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false)
  }
 
  const handleUpdateCourse = async (event) => {
    event.preventDefault();
    console.log("event" , event)
    const updatedCourse = {
      _id: selectedCourse.id,  // Include the course ID
      courseName: event.target[0].value,
      testFormUrl: event.target[2].value,
      applicantsEnrolled : event.target[4].value
    };

    console.log('Updating course with:', updatedCourse); // Log the updated course data

    try {
      const response = await fetch(`http://localhost:3005/admin/update-course-by-id`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) {
        const errorDetails = await response.text(); // Get error details from the response
        throw new Error(`Failed to update course: ${errorDetails}`);
      }

      const data = await response.json();
      console.log('Updated course:', data);

      // Update the coursesData state with the new course details
      setCoursesData((prevData) => 
        prevData.map((course) =>
          course.id === selectedCourse.id ? { ...course, 
            courseName: updatedCourse.courseName, 
            testFormUrl: updatedCourse.testFormUrl, 
            applicantsEnrolled: updatedCourse.applicantsEnrolled } : course
        )
      );

      setUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating course:', error);
    }
};



  const handleDeleteCourse = async (course) => {
    console.log("course delete " , course)
    try {
      const response = await fetch(`http://localhost:3005/admin/delete-course-by-id/${course.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
      }
  
      const data = await response.json();
      console.log("Deleted applicant data:", data);
  

    } catch (error) {
        console.error('Error updating applicant:', error);
      }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formValues = {
      courseName: event.target[0].value,
      testFormUrl: event.target[2].value
    };

    try {
      const response = await fetch("http://localhost:3005/admin/create-course", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const data = await response.json();
      console.log("uploaded", data);

      // Add the new course to the coursesData state
      const newCourse = {
        id: data.data._id,
        courseName: data.data.courseName,
        testFormUrl: data.data.testFormUrl,
        applicantsEnrolled: data.data.applicant ? data.data.applicant.length : 0,
      };
      setCoursesData((prevData) => [...prevData, newCourse]);

      handleClickClose();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    {
      field: "courseName",
      headerName: "Course Name",
      flex: 1.3,
      cellClassName: "name-column--cell",
    },
    {
      field: "testFormUrl",
      headerName: "Test Form URL",
      flex: 2,
    },
    {
      field: "applicantsEnrolled",
      headerName: "Applicant's Enrolled",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1.4,
      renderCell: (params) => {
      const course = params.row
        return (
          <>
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
              onClick={() => handleUpdateModalOpen(course)}
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
              }}
              onClick={() => handleDeleteCourse(course)}

              >
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
  <Header
    title="COURSES"
    subtitle="Managing The Course's.."
  />
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
          <LibraryBooksOutlinedIcon sx={{ mr: "10px" }} />
          Add A Course
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClickClose}>
        <DialogTitle>Add a Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details of the new course.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="coursename"
              label="CourseName"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              id="testformurl"
              label="Test Form URL"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
            
            <DialogActions>
              <Button onClick={handleClickClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                Add Course
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={updateModalOpen} onClose={handleUpdateModalClose}>
        <DialogTitle>Update A Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the Details to update the courses data.
          </DialogContentText>
          <form onSubmit={handleUpdateCourse}>
            <TextField
              autoFocus
              margin="dense"
              id="coursename"
              label="Course Name"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={selectedCourse?.courseName}
              required
            />
            <TextField
              margin="dense"
              id="testformurl"
              label="Test Form URL"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={selectedCourse?.testFormUrl}
              required
            />
            <TextField
              margin="dense"
              id="applicant'senrolled"
              label="Applicant's Enrolled"
              type="number"
              fullWidth
              defaultValue={selectedCourse?.applicantsEnrolled}
              variant="outlined"
            
              required
            />
            <DialogActions>
              <Button onClick={handleUpdateModalClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                Update Course
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={coursesData}
          columns={columns}
          // components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Courses;
