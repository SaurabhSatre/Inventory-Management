import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BootstrapNavbar = ({ onLogout, name = "User" }) => {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="shadow-lg py-3" style={{ borderBottom: '2px solid #e0e0e0' }}>
      <Container className="d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex flex-column flex-md-row align-items-center">
          <Navbar.Brand className="mb-1 mb-md-0" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3f51b5' }}>
            Inventory Management
          </Navbar.Brand>
          <span className="ms-md-4 mt-1 mt-md-0" style={{ fontSize: '1.2rem', color: '#555' }}>
            Welcome, <strong>{name}</strong>
          </span>
        </div>
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
