// react-router 4's withRouter() is gone in current react-router; the class components
// get the two things they used from it as props: navigate(path) and params.
import React from 'react';
import { useNavigate, useParams } from 'react-router';

export default function withRouter(Component) {
  function WithRouter(props) {
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} navigate={navigate} params={params} />;
  }
  WithRouter.displayName = `withRouter(${Component.displayName || Component.name || 'Component'})`;
  return WithRouter;
}
