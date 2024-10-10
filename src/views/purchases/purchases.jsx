import React from 'react';
import { Card } from 'react-bootstrap';


const Purchases = () => {   

    return (
        <React.Fragment>
             <Card.Body>
              <h1>COMPRAS</h1>
              <Card.Text className="text-muted mb-4">
                Suspendisse vel quam malesuada, aliquet sem sit amet, fringilla elit. Morbi tempor tincidunt tempor. Etiam id turpis
                viverra, vulputate sapien nec, varius sem. Curabitur ullamcorper fringilla eleifend. In ut eros hendrerit est consequat
                posuere et at velit.
              </Card.Text>             
            </Card.Body>
        </React.Fragment>
      );
}

export default Purchases;