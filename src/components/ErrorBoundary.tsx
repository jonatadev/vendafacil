import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught', error, info);
    // Example integration with Sentry
    // Sentry.captureException(error, { extra: info });
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 4 }}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" color="error" gutterBottom>
              Ocorreu um erro na aplicação
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
              {String(this.state.error && this.state.error.stack ? this.state.error.stack : this.state.error)}
            </Typography>
            <Button variant="contained" onClick={this.reset}>Tentar novamente</Button>
          </Paper>
        </Box>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
