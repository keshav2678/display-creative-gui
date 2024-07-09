import React, { useState, useContext, useEffect } from 'react';
import { PackageContext } from '../../context/PackageContext';
import { TextField, Button, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Box, Chip, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './AddTracker.css';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const AddTracker = ({ setIsModalOpen, creativeOptions, editTrackerData }) => {
  const { selectedPackage } = useContext(PackageContext);
  const [formData, setFormData] = useState({
    campaignName: '',
    platform: '',
    geolocation: '',
    validFrom: '',
    validTo: '',
    cappingThreshold: '',
    cappingTimeframe: 'daily',
    rollingWindowPeriod: '',
    enableFcapAcrossPlatform: false,
    enableBrandSafety: false,
    enableAdFraud: false,
    enableDoubleSpotting: false,
    creativeId: [],
    customTrackers: [],
  });
  console.log(formData)

  const [showCustomTracker, setShowCustomTracker] = useState(false);
  const [customTracker, setCustomTracker] = useState({ type: 'Click Through Tracker', url: '' });

  useEffect(() => {
    if (editTrackerData) {
      setFormData({
        campaignName: editTrackerData.campaign_name || '',
        platform: editTrackerData.platform_name || '',
        geolocation: editTrackerData.geolocation || '',
        validFrom: editTrackerData.from_date || '',
        validTo: editTrackerData.to_date || '',
        cappingThreshold: editTrackerData.frequency_cap_threshold || '',
        cappingTimeframe: editTrackerData.rolling_window_timeframe ? 'rolling window' : 'daily',
        rollingWindowPeriod: editTrackerData.rolling_window_timeframe || '',
        enableFcapAcrossPlatform: editTrackerData.is_cross_platform_fcap_enabled || false,
        enableBrandSafety: editTrackerData.is_brand_safety_enabled || false,
        enableAdFraud: editTrackerData.is_ad_fraud_enabled || false,
        enableDoubleSpotting: editTrackerData.is_double_spotting_enabled || false,
        creativeId: editTrackerData.creative_id ? editTrackerData.creative_id.split(',') : [],
        customTrackers: editTrackerData.custom_trackers || [],
      });
    }
  }, [editTrackerData]);

  const resetFormData = () => {
    setFormData({
      campaignName: '',
      platform: '',
      geolocation: '',
      validFrom: '',
      validTo: '',
      cappingThreshold: '',
      cappingTimeframe: 'daily',
      rollingWindowPeriod: '',
      enableFcapAcrossPlatform: false,
      enableBrandSafety: false,
      enableAdFraud: false,
      enableDoubleSpotting: false,
      creativeId: [],
      customTrackers: [],
    });
    setShowCustomTracker(false);
    setCustomTracker({ type: 'Click Through Tracker', url: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestData = {
        ...formData,
        package_name: selectedPackage,
        creativeId: formData.creativeId.join(','),  // Convert array to comma-separated string
      };

      if (editTrackerData) {
        const response = await axios.put(`http://localhost:8000/update_tracker/${editTrackerData.id}`, {
          data: requestData,
        });
        console.log('Updated tracker:', response.data);
      } else {
        const response = await axios.post('http://localhost:8000/add_tracker', {
          data: requestData,
        });
        console.log('Added tracker:', response.data);
      }

      setIsModalOpen(false);
      resetFormData();
    } catch (error) {
      console.error('Failed to add/update tracker:', error);
      setIsModalOpen(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleCappingTimeframeChange = (event) => {
    const value = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      cappingTimeframe: value,
      rollingWindowPeriod: value !== 'rolling window' ? '' : prevState.rollingWindowPeriod,
    }));
  };

  const handleCreativeIdChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prevState) => ({
      ...prevState,
      creativeId: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleAddCustomTracker = () => {
    setFormData((prevState) => ({
      ...prevState,
      customTrackers: [...prevState.customTrackers, customTracker],
    }));
    setCustomTracker({ type: 'Click Through Tracker', url: '' });
    setShowCustomTracker(false);
  };

  const inputStyles = {
    '& .MuiInputBase-input': {
      height: '50px',
      display: 'flex',
      alignItems: 'center',
    },
  };

  const smallInputStyles = {
    '& .MuiInputBase-input': {
      height: '40px',
      display: 'flex',
      alignItems: 'center',
    },
  };

  return (
    <div className="add-tracker">
      <form onSubmit={handleSubmit}>
        <div className="basic-details">
          <h3>Basic Details</h3>
          <div className="row-flex">
            <div className="form-group">
              <TextField
                label="Campaign Name"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleChange}
                required
                fullWidth
                sx={inputStyles}
              />
            </div>
            <div className="form-group">
              <TextField
                label="Platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                fullWidth
                sx={inputStyles}
              />
            </div>
          </div>
          <div className="row-flex">
            <div className="form-group row-flex ">
              <TextField
                label="Geolocation"
                name="geolocation"
                value={formData.geolocation}
                onChange={handleChange}
                required
                fullWidth
                sx={inputStyles}
              />
              <FormControl id="creativeid-cont" fullWidth>
                <InputLabel id="test-select-label">Creative ID</InputLabel>
                <Select
                  labelId="test-select-label"
                  label="Creative Id"
                  multiple
                  value={formData.creativeId}
                  onChange={handleCreativeIdChange}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value) => (
                        <Chip sx={{ marginRight: "5px" }} key={value} label={creativeOptions.find(option => option.id === value)?.name || value} />
                      ))}
                    </div>
                  )}
                  sx={inputStyles}
                >
                  {creativeOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {`${option.id}_${option.name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </div>
          </div>
        </div>
        <div className="frequency-cap">
          <h3>Frequency CAP Config</h3>
          <div className="row-flex">
            <div className="form-group">
              <TextField
                label="Capping Threshold"
                name="cappingThreshold"
                value={formData.cappingThreshold}
                onChange={handleChange}
                type="number"
                required
                fullWidth
                sx={inputStyles}
              />
            </div>
            <div className="form-group">
              <TextField
                name="cappingTimeframe"
                value={formData.cappingTimeframe}
                onChange={handleCappingTimeframeChange}
                select
                fullWidth
                label="Capping Timeframe"
              >

                <MenuItem key={1} value="daily">Daily</MenuItem>
                <MenuItem key={2} value="monthly">Monthly</MenuItem>
                <MenuItem key={3} value="rolling window">Rolling Window</MenuItem>
                <MenuItem key={4} value="lifetime">Lifetime</MenuItem>
                <MenuItem key={5} value="custom">Custom</MenuItem>
              </TextField>

            </div>
          </div>
          {formData.cappingTimeframe === 'custom' && (
            <div className="row-flex">
              <div className="form-group row-flex">
                <TextField
                  label="Valid From"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  fullWidth
                  sx={inputStyles}
                />
                <TextField
                  label="Valid To"
                  name="validTo"
                  value={formData.validTo}
                  onChange={handleChange}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  fullWidth
                  sx={inputStyles}
                />
              </div>
            </div>
          )}
          {formData.cappingTimeframe === 'rolling window' && (
            <div className="row-flex">
              <div className="form-group">
                <TextField
                  label="Rolling Window Period (days)"
                  name="rollingWindowPeriod"
                  value={formData.rollingWindowPeriod}
                  onChange={handleChange}
                  type="number"
                  required
                  fullWidth
                  sx={inputStyles}
                />
              </div>
            </div>
          )}
          <div className="row-flex">
            <FormControlLabel
              control={<Checkbox name="enableBrandSafety" checked={formData.enableBrandSafety} onChange={handleChange} />}
              label="Enable Brand Safety"
            />
            <FormControlLabel
              control={<Checkbox name="enableAdFraud" checked={formData.enableAdFraud} onChange={handleChange} />}
              label="Enable Ad Fraud"
            />
          </div>
        </div>
        <div className="custom-trackers">
          <h3>Custom Trackers</h3>
          {
            !showCustomTracker ? (
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setShowCustomTracker(true)}
              >
                Add new Tracker
              </Button>
            ) : null
          }

          {showCustomTracker && (
            <div className="row-flex">
              <div className="form-group custom-trackers-field" style={{ width: '30%' }}>

                <TextField
                  name="trackerType"
                  value={customTracker.type}
                  onChange={(e) => setCustomTracker({ ...customTracker, type: e.target.value })}
                  select
                  fullWidth
                  label="Tracker Name"
                >

                  <MenuItem key={1} value="Click Through Tracker">Click Through Tracker</MenuItem>

                </TextField>

              </div>
              <div className="form-group custom-trackers-field" style={{ width: '60%' }}>
                <TextField
                  label="Tracker URL"
                  name="trackerUrl"
                  value={customTracker.url}
                  onChange={(e) => {
                    console.log(e.target.value)
                    setCustomTracker({ ...customTracker, url: e.target.value })
                    setFormData((prevState) => ({
                      ...prevState,
                      customTrackers: [{
                        type: customTracker.type,
                        url: e.target.value
                      }]
                    }))
                  }}
                  fullWidth
                  sx={smallInputStyles}
                  required
                />
              </div>
              <IconButton            sx={{
              ml: 1,
              "&.MuiButtonBase-root:hover": {
                bgcolor: "transparent"
              }
            }} aria-label="delete">
                <DeleteIcon onClick={() => {
                  setCustomTracker({ type: 'Click Through Tracker', url: '' })
                  setFormData((prevState) => ({
                    ...prevState,
                    customTrackers: []
                  }))
                  setShowCustomTracker(false)
                }} />
              </IconButton>
              {/* <Button variant="contained" color="primary" onClick={handleAddCustomTracker} style={{ height: '40px' }}>
                Add
              </Button> */}
            </div>
          )}
        </div>
        <div className="form-actions" style={{marginTop: '10px'}}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setIsModalOpen(false);
              resetFormData();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {editTrackerData ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTracker;
