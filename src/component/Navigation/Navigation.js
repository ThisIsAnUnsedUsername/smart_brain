import React from 'react';

const Navigation = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {/*justify-content need to written as camel case in JSX*/}
      <p className="f3 link dim black underline pa3 pointer">Sign Out</p>
    </nav>
  );
};

export default Navigation;
