import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown } from 'react-bootstrap';

// assets
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';


// ==============================|| NAV RIGHT ||============================== //

const NavRight = () => { 
  // const user_name = 
  const [user_name] = useState(localStorage.getItem('name') || '')
  const handleLogout = () => {
    localStorage.removeItem('token');
  }

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">   
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <img src={avatar1} className="img-radius wid-40" alt="User Profile" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span>{user_name}</span>
                <Link to="#" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">                
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item" onClick={handleLogout}>
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>      
    </React.Fragment>
  );
};

export default NavRight;
