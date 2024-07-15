import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Skeleton from '@mui/material/Skeleton';
import './Creatives.css';
import { PackageContext } from '../../context/PackageContext';


const Creatives = () => {
  const { selectedPackage } = useContext(PackageContext);
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCreatives = async (page, pageSize) => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/get_creatives', {
        params: {
          page: page + 1,
          rows_per_page: pageSize,
          package_name:selectedPackage
        },
      });
      setRows(response.data.creatives);
      setRowCount(response.data.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching creatives:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatives(page, pageSize);
  }, [page, pageSize,selectedPackage]);

  const handleDelete = async (rowId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/delete_creative/${rowId}`);
      console.log('Deleted creative:', response.data);
      fetchCreatives(page, pageSize);
    } catch (error) {
      console.error('Error deleting creative:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 70, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={70} /> : params.value },
    { field: 'creative_name', headerName: 'Creative Name', flex: 1, minWidth: 200, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={200} /> : params.value },
    { field: 'creative_height', headerName: 'Height', type: 'number', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'creative_width', headerName: 'Width', type: 'number', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : (
        <IconButton onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="creatives" style={{ width: '100%' }}>
      <DataGrid
        rows={isLoading ? Array.from(new Array(pageSize)).map((_, index) => ({ id: `skeleton-${index}` })) : rows}
        columns={columns}
        pageSize={pageSize}
        rowCount={rowCount}
        paginationMode="server"
        onPaginationModelChange={newPage => {
          const { page, pageSize } = newPage;
          setPage(page);
          setPageSize(pageSize);
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#EDE4F7',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#c9b3e6',
          },
        }}
      />
    </div>
  );
};

export default Creatives;
