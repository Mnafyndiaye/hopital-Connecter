import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

export default function AdminDashboard() {
  const [formType, setFormType] = useState('medecin');
  const [formData, setFormData] = useState({});
  const [assistants, setAssistants] = useState([]);
  const [medecins, setMedecins] = useState([]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === 'medecin' ? '/api/medecins' : '/api/assistants';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(`${formType === 'medecin' ? 'Médecin' : 'Assistant'} ajouté avec succès`);
      setFormData({});
      fetchUsers();
    } catch (err) {
      alert('Erreur : ' + err.message);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [resA, resM] = await Promise.all([
        fetch('/api/assistants', { headers }),
        fetch('/api/medecins', { headers }),
      ]);
      setAssistants(await resA.json());
      setMedecins(await resM.json());
    } catch (err) {
      alert('Erreur de chargement : ' + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord Admin
      </Typography>

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={formType}
          exclusive
          onChange={(e, value) => value && setFormType(value)}
          aria-label="Choisir le type"
        >
          <ToggleButton value="medecin">Médecin</ToggleButton>
          <ToggleButton value="assistant">Assistant</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Ajouter un {formType === 'medecin' ? 'médecin' : 'assistant'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField name="username" label="Nom d'utilisateur" fullWidth required onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="password" label="Mot de passe" type="password" fullWidth required onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="nom" label="Nom" fullWidth required onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="prenom" label="Prénom" fullWidth required onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="telephone" label="Téléphone" fullWidth required onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="email" label="Email" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="adresse" label="Adresse" fullWidth onChange={handleChange} />
            </Grid>

            {formType === 'medecin' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField name="specialite" label="Spécialité" fullWidth required onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="numeroSS" label="N° Sécurité Sociale" fullWidth required onChange={handleChange} />
                </Grid>
              </>
            )}
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Enregistrer
            </Button>
          </Box>
        </form>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6">Médecins enregistrés</Typography>
      <List>
        {medecins.map((m) => (
          <ListItem key={m.id}>
            <ListItemText primary={`Dr ${m.nom} ${m.prenom}`} secondary={m.specialite} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ mt: 4 }}>Assistants médicaux</Typography>
      <List>
        {assistants.map((a) => (
          <ListItem key={a.id}>
            <ListItemText primary={`${a.nom} ${a.prenom}`} secondary={a.telephone} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
