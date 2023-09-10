import Header from '../Header/Header';
import './Dashboard.css';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    date: "",
    skills: "",
    status: "active",
    isEditing: false,
    editId: null
  });
  const [dialogState, setDialogState] = useState({
    dialogOpen: false,
    deleteId: null
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5
  });
  const [sort, setSort] = useState({
    column: "date",
    direction: "asc"
  });

  const handleClose = () => {
    setOpen(false);
    setFormData({
      date: "",
      skills: "",
      status: "active",
      isEditing: false,
      editId: null
    });
  };

  const handleSort = (column) => {
    const direction = sort.column === column && sort.direction === "asc" ? "desc" : "asc";
    setSort({
      column: column,
      direction: direction
    });
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.date) tempErrors.date = "Date is required!";
    if (!formData.skills) tempErrors.skills = "Skills are required!";
    if (!formData.status) tempErrors.status = "Status is required!";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleDelete = () => {
    const id = dialogState.deleteId;
    axios.delete(`http://localhost:5000/dailyActivity/${id}`)
      .then(response => {
        toast.success("Skill deleted successfully!");
        setTableData(tableData.filter(item => item.id !== id));
        setDialogState({
          dialogOpen: false,
          deleteId: null
        });
      })
      .catch(error => {
        console.error('Error deleting data:', error);
      });
  };

  const handleEdit = (row) => {
    setFormData({
      ...row,
      isEditing: true,
      editId: row.id
    });
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = 'http://localhost:5000/dailyActivity';
    if (validateForm()) {
      if (formData.isEditing) {
        axios.put(`${url}/${formData.editId}`, formData)
          .then(response => {
            toast.success("Data updated successfully!");
            const updatedTableData = tableData.map(item => item.id === formData.editId ? formData : item);
            setTableData(updatedTableData);
            handleClose();
          })
          .catch(error => {
            console.error('Error updating data:', error);
          });
      } else {
        axios.post(url, formData)
          .then(response => {
            toast.success("Skill added successfully!");
            setTableData([...tableData, formData]);
            handleClose();
          })
          .catch(error => {
            console.error('Error adding data:', error);
          });
      }
    }
  };

  useEffect(() => {
    axios.get('http://localhost:5000/dailyActivity')
      .then(response => {
        setTableData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const sortedTableData = [...tableData].sort((a, b) => {
    if (sort.column === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sort.direction === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sort.column === "skills") {
      return sort.direction === "asc"
        ? a.skills.localeCompare(b.skills)
        : b.skills.localeCompare(a.skills);
    } else {
      return 0;
    }
  });

  return (
    <>
      <ToastContainer />
      <Header />
      <div className='box'>
        <Button className="button-left" variant="contained" onClick={() => setOpen(true)} startIcon={<AddIcon />}>
          Add skills
        </Button>
        <TextField value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by skills" fullWidth style={{ marginBottom: '20px' }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: 'green' }}>
              <TableRow>
                <TableCell onClick={() => handleSort("date")}>Date {sort.column === "date" && (sort.direction === "asc" ? " 🔼" : " 🔽")}</TableCell>
                <TableCell onClick={() => handleSort("skills")}>Skills {sort.column === "skills" && (sort.direction === "asc" ? " 🔼" : " 🔽")}</TableCell>
                <TableCell>Status</TableCell>
                <TableCell style={{ paddingLeft: '8%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTableData.filter(row => {
                if (!searchTerm) return true;
                return row.skills.toLowerCase().includes(searchTerm.toLowerCase());
              })
                .slice(pagination.page * pagination.rowsPerPage, pagination.page * pagination.rowsPerPage + pagination.rowsPerPage)
                .map(row => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.skills}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={() => handleEdit(row)}>Edit</Button>
                      <Button variant="contained" onClick={() => setDialogState({ dialogOpen: true, deleteId: row.id })} style={{ backgroundColor: 'red', color: 'white' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#b30000'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'red'}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={tableData.length}
          page={pagination.page}
          onPageChange={(event, newPage) => setPagination({ ...pagination, page: newPage })}
          rowsPerPage={pagination.rowsPerPage}
          onRowsPerPageChange={(event) => setPagination({ ...pagination, rowsPerPage: +event.target.value })}
        />
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: 400,
            padding: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 10px 28px rgba(0,0,0,0.08)', // Add subtle shadow
            border: 'none',
            borderRadius: 2,
            p: 3,
            mx: 'auto',
            mt: '5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            transition: 'all 0.3s' // Smooth transition
          }}
        >
          <Typography variant="h6" component="h2" style={{ fontWeight: 'bold', marginBottom: '15px' }}>
            Add Skills
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth required error={!!errors.date} style={{ marginTop: '15px' }} helperText={errors.date} label="Date" variant="outlined" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <TextField fullWidth required error={!!errors.skills} style={{ marginTop: '15px' }} helperText={errors.skills} label="Skills" variant="outlined" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
            <FormControl fullWidth variant="outlined" style={{ marginTop: '15px' }}>
              <InputLabel>Status</InputLabel>
              <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} label="Status">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{
                marginTop: '1rem',
                padding: '10px 0',
                boxShadow: '0 5px 10px rgba(0,0,0,0.12)', // Add button shadow
                transition: 'all 0.3s' // Button transition
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} // Slightly enlarge button on hover
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {formData.isEditing ? 'Update' : 'Add'}
            </Button>
          </form>
        </Box>
      </Modal>
      <Dialog open={dialogState.dialogOpen} onClose={() => setDialogState({ dialogOpen: false, deleteId: null })}>
        <DialogTitle>{"Are you sure you want to delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogState({ dialogOpen: false, deleteId: null })} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Dashboard;
