import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import '../../../assets/scss/themes/_homecustom.scss';

const JWTLogin = () => {
  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                className="form-control"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
                placeholder="Email Address / Username"
              />
              {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                placeholder="Password"
              />
              {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
            </div>

            <div className="custom-control custom-checkbox text-start mb-4 mt-2">
              <input type="checkbox" className="custom-control-input" id="customCheck1" />
              <label className="custom-control-label" htmlFor="customCheck1">
                Save credentials.
              </label>
            </div>

            {errors.submit && (
              <Col sm={12}>
                <Alert variant="danger">{errors.submit}</Alert>
              </Col>
            )}

           
            <Row>
              <Col mt={2}>
                <Button className="btn-block mb-4" disabled={isSubmitting} size="large" type="submit" variant="primary">
                  Ingresar
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik> 
      
      {/* Para implementar como una tarea adicional algo extra, por el momento sólo dejar el botón ingresar*/}
      {/* <Row>
        <Col sm={12}>
          <h5 className="my-3"> O </h5>
        </Col>
      </Row>
        
      <Row>
        <Col sm={12}>
          <Button variant="danger">
            <i className="fa fa-lock" /> Ingresar con Google
          </Button>
        </Col>
      </Row> */}

      <hr />
    </>
  );
};

export default JWTLogin;
