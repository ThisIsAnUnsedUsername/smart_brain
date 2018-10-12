import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className="white f3">{`${name}, your current entries count is...`}</div>
      {/*JS way to add text with{'text'}*/}
      <div className="white f1">{entries}</div>
    </div>
  );
};

export default Rank;
