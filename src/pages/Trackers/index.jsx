import React, { useState, useContext, useEffect } from 'react';
import { PackageContext } from '../../context/PackageContext';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import AddTracker from '../../components/AddTracker';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './Trackers.css';
import LinkModal from '../../components/AddTracker/LinkModal';

const Trackers = () => {
  const { selectedPackage } = useContext(PackageContext);
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creativeOptions, setCreativeOptions] = useState([]);
  const [editTrackerData, setEditTrackerData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [displayUrl, setDisplayUrl] = useState()
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleAddTracker = (url) => {
      setDisplayUrl(url);
      setIsLinkModalOpen(true);
  };
  const getCreativeOptions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get_creative_options', {
        params: {
          package_name: selectedPackage,
        },
      });
      console.log(response.data)
      setCreativeOptions(response.data);
    } catch (error) {
      console.error('Error fetching creative options:', error);
    }
  };

  const fetchTrackers = async (page, pageSize) => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/get_trackers', {
        params: {
          page: page+1,
          rows_per_page: pageSize,
          package_name: selectedPackage,
        },
      });
      setRows(response.data.trackers);
      setRowCount(response.data.total);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching trackers:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackers(page, pageSize);
  }, [page, pageSize,selectedPackage]);

  useEffect(() => {
    getCreativeOptions();
  }, [selectedPackage]);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 70, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={70} /> : params.value },
    { field: 'campaign_name', headerName: 'Campaign Name', flex: 1, minWidth: 150, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={200} /> : params.value },
    { field: 'platform_name', headerName: 'Platform Name', flex: 0.5, minWidth: 150, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'geolocation', headerName: 'Geolocation', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'creative_id', headerName: 'Creative ID', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'frequency_cap_criteria', headerName: 'Frequency Cap Criteria', flex: 0.5, minWidth: 150, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'from_date', headerName: 'From Date', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'to_date', headerName: 'To Date', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'rolling_window_timeframe', headerName: 'Rolling Window Timeframe', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'frequency_cap_threshold', headerName: 'Frequency Cap Threshold', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'is_cross_platform_fcap_enabled', headerName: 'Cross Platform FCAP', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'is_brand_safety_enabled', headerName: 'Brand Safety', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'is_ad_fraud_enabled', headerName: 'Ad Fraud', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    { field: 'is_double_spotting_enabled', headerName: 'Double Spotting', flex: 0.5, minWidth: 100, renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : params.value },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (row) => {
    setEditTrackerData(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (rowId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/delete_tracker/${rowId}`);
      console.log('Deleted campaign:', response.data);
      fetchTrackers(page, pageSize);
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleOpenModal = () => {
    setEditTrackerData(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row to export.');
      return;
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    const header = Object.keys(selectedRows[0]).join(',');
    const rowsContent = selectedRows.map(row => {
      const formattedRow = Object.keys(row).map(key => {
        if (key === 'from_date' || key === 'to_date') {
          return formatDate(row[key]);
        }
        return row[key];
      });
      return formattedRow.join(',');
    }).join('\n');
    const csvContent = `${header}\n${rowsContent}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'selected_rows.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('CSV export is not supported by this browser.');
    }
  };
  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  if (!selectedPackage) {
    return <div className="message">Please choose a package to move forward.</div>;
  }

  return (
    <div className="trackers" style={{ width: '100%' }}>
      <div className='trackers-btn-container'>
        <button className='trackers-btn' onClick={handleOpenModal}>Add Tracker</button>
        <button className='trackers-btn' onClick={handleExportCSV}>Export Data</button>
      </div>
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
        onRowSelectionModelChange={(ids) => {
          const selectedIDs = new Set(ids);
          const selectedRows = rows.filter((row) =>
            selectedIDs.has(row.id)
          );
          setSelectedRows(selectedRows);
        }}
      />
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box className='modal-box'>
          <AddTracker
            fetchTrackers={fetchTrackers}
            page={page}
            pageSize={pageSize}
            setIsModalOpen={setIsModalOpen}
            creativeOptions={creativeOptions}
            editTrackerData={editTrackerData} 
            handleAddTracker={handleAddTracker}
          />
        </Box>
      </Modal>
      <LinkModal
        open={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        displayUrl={displayUrl}
      />
    </div>
  );
};

export default Trackers;
