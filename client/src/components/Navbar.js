import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BootstrapNavbar = ({ onLogout }) => {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="shadow-lg py-3" style={{ borderBottom: '2px solid #e0e0e0' }}>
      <Container className="d-flex justify-content-between align-items-center flex-wrap"> 
        <Navbar.Brand className="text-center flex-grow-1 flex-md-grow-0 me-md-auto mb-2 mb-md-0" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3f51b5' }}>
          Inventory Dashboard
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="outline-primary" size="lg" onClick={onLogout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default BootstrapNavbar;