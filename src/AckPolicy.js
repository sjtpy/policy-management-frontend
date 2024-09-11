import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AckPolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [acknowledgedPolicies, setAcknowledgedPolicies] = useState(new Set());
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = Cookies.get('userData');
    if (!userData) {
      navigate('/');
    } else {
      try {
        const user = JSON.parse(userData);
        if (user.role !== 'employee') {
          navigate('/');
        } else {
          // Fetch approved policies
          axios.get('http://localhost:3005/api/policy/policyversions?status=Approved')
            .then(response => {
              setPolicies(response.data);
              if (response.data.length === 0) {
                setMessage('No policies available for acknowledgment.');
              }
            })
            .catch(error => {
              console.error('Error fetching policies:', error);
              setMessage('Error fetching policies');
            });

          // Fetch acknowledged policies for this employee
          axios.get(`http://localhost:3005/api/policy/acknowledgements/${user.userId}`)
            .then(response => {
              const acknowledgedPolicyIds = response.data.map(ack => ack.policyVersionId);
              setAcknowledgedPolicies(new Set(acknowledgedPolicyIds));
            })
            .catch(error => {
              console.error('Error fetching acknowledged policies:', error);
              setMessage('Error fetching acknowledged policies');
            });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/');
      }
    }
  }, [navigate]);

  const handleAcknowledge = (policyId) => {
    const userData = Cookies.get('userData');
    if (!userData) {
      navigate('/');
      return;
    }

    const user = JSON.parse(userData);
    const employeeId = user.userId;
    const triggerType = 'Manual'; 

    axios.post('http://localhost:3005/api/policy/acknowledge', {
      employeeId,
      policyVersionId: policyId,
      triggerType
    })
      .then(response => {
        setAcknowledgedPolicies(new Set([...acknowledgedPolicies, policyId]));
        setMessage('Policy acknowledged successfully.');
      })
      .catch(error => {
        console.error('Error acknowledging policy:', error);
        setMessage('Error acknowledging policy.');
      });
  };

  return (
    <div>
      <h1>Policies to Acknowledge</h1>
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
   {acknowledgedPolicies.has(policy._id) ? (
                     <button disabled>Acknowledged</button>) : (<button onClick={() => handleAcknowledge(policy._id)}>I agree to abide by the policies</button>
                    )}             
               </li>          
                    ))}         
                   </ul>
      ) : (
        <p>No policies available to acknowledge</p>
      )}
    </div>
  );
};

export default AckPolicy;
