// pages/_error.js
function Error({ statusCode }) {
    return (
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    );
  }
  
  Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    if (err) {
      console.error('Error occurred:', err);
    }
    return { statusCode };
  };
  
  export default Error;
  