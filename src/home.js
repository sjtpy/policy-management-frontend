import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCreatePolicy = () => {
    navigate('/createpolicy');
  };

  const handleApprovePolicy = () => {
    navigate('/approvepolicy');
  };
  const handleAckPolicy = () => {
    navigate('/ackpolicy');
  };
  
  return (
    <div>
      <h2>Home</h2>
      {/* Button to create policy */}
      <button onClick={handleCreatePolicy}>Create Policy</button>
      <button onClick={handleApprovePolicy}>Approve Policy</button>
      <button onClick={handleAckPolicy}>Acknowledge Policy</button>
    </div>
  );
};

export default Home;
