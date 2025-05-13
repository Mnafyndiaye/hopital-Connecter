// PatientSidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, CalendarToday, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PatientSidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{ width: 240, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' } }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/patient')}>
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Mes Données" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/patient/appointments')}>
            <ListItemIcon><CalendarToday /></ListItemIcon>
            <ListItemText primary="Mes Rendez-vous" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/patient/medical-records')}>
            <ListItemIcon><Assignment /></ListItemIcon>
            <ListItemText primary="Mes Dossiers Médicaux" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default PatientSidebar;
