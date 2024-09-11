import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ApprovePolicyVersions = () => {
  const [policies, setPolicies] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = Cookies.get('userData');
    if (!userData) {
      navigate('/');
    } else {
      try {
        const user = JSON.parse(userData);
        if (user.role !== 'ceo') {
          navigate('/');
        } else {
          axios.get('http://localhost:3005/api/policy/policyversions?status=Pending')
            .then(response => setPolicies(response.data))
            .catch(error => console.error('Error fetching policies:', error));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/');
      }
    }
  }, [navigate]);

  const handleApprove = (policyVersionId) => {
    axios.post(`http://localhost:3005/api/policy/approve/${policyVersionId}`)
      .then(response => {
        setMessage('Policy version approved successfully!');
        setPolicies(policies.filter(policy => policy._id !== policyVersionId));
      })
      .catch(error => {
        console.error('Error approving policy version:', error);
        setMessage('Error approving policy version');
      });
  };

  return (
    <div>
      <h2>Approve Policy Versions</h2>
      {message && <p>{message}</p>}
      {policies.length > 0 ? (
      <ul>
        {policies.map(policy => (
          <li key={policy._id}>
            <h3>Policy Version ID: {policy._id}</h3>
            <p>Company ID: {policy.policyId.companyId}</p> 
            <p>Is Custom: {policy.policyId.isCustom ? 'Yes' : 'No'}</p>
            <p>Content: {policy.policyContent}</p>
            <p>Configuration: {JSON.stringify(policy.configuration)}</p>
            <button 
              onClick={() => handleApprove(policy._id)}
              disabled={policy.approvalStatus === 'Approved'}
            >
              {policy.approvalStatus === 'Approved' ? 'Approved' : 'Approve'}
            </button>
          </li>
        ))}
      </ul>
      ) : (
        !message && <p>No policies to approve.</p>
      )}
    </div>
  );
};

export default ApprovePolicyVersions;
