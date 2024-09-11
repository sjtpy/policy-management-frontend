import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const CreatePolicy = () => {
  const [templates, setTemplates] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [policyContent, setPolicyContent] = useState('');
  const [configuration, setConfiguration] = useState({});
  const [configKey, setConfigKey] = useState('');
  const [configValue, setConfigValue] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const userData = Cookies.get('userData');

    if (!userData) {
      navigate('/'); 
    } else {
      try {
        const user = JSON.parse(userData);
        if (user.role !== 'hr') {
          navigate('/');
        } else {
          // Set the companyId from the cookie
          setCompanyId(user.companyId);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/'); // Redirect if there's an issue with the user data
      }
    }
  }, [navigate]);

  useEffect(() => {
    axios.get('http://localhost:3005/api/policytemplate')
      .then(response => {
        console.log('Fetched data:', response.data); // Log the response data
        // Extract templates array from the response
        if (Array.isArray(response.data.templates)) {
          setTemplates(response.data.templates);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      })
      .catch(error => console.error('Error fetching templates:', error));
  }, []);

  const handleAddConfig = () => {
    if (configKey && configValue) {
      setConfiguration({ ...configuration, [configKey]: configValue });
      setConfigKey('');
      setConfigValue('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const policyData = {
      companyId,
      templateId: isCustom ? null : templateId, // If custom, templateId is null
      isCustom,
      policyContent,
      configuration,
    };
    console.log(policyData);

    axios.post('http://localhost:3005/api/policy', policyData)
      .then(response => {
        setMessage('Policy created successfully!');
        // Reset form fields after successful submission
        setCompanyId('');
        setTemplateId('');
        setIsCustom(false);
        setPolicyContent('');
        setConfiguration({});
      })
      .catch(error => {
        console.error('Error creating policy:', error);
        setMessage('Error creating policy');
      });
  };

  return (
    <div>
      <h2>Create Policy</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company ID:</label>
          <p>{companyId}</p> {/* Display companyId as plain text */}
        </div>

        <div>
          <label>Policy Type:</label>
          <select 
            value={isCustom ? 'custom' : templateId} 
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'custom') {
                setIsCustom(true);
                setTemplateId('');
              } else {
                setIsCustom(false);
                setTemplateId(value);
              }
            }}
          >
            <option value="">Select a Template</option>
            {templates.map(template => (
              <option key={template._id} value={template._id}>
                {template.templateName}
              </option>
            ))}
            <option value="custom">Custom Policy</option>
          </select>
        </div>

        {isCustom && (
          <div>
            <label>Policy Content:</label>
            <textarea 
              value={policyContent} 
              onChange={(e) => setPolicyContent(e.target.value)} 
              rows="10" // Adjust the number of visible rows
              cols="50" // Adjust the width (number of columns)
              placeholder="Enter policy content here..."
              required 
              style={{ marginBottom: '10px' }} // Optional, add spacing if needed
            />
          </div>
        )}
      {isCustom && (
        <div>
          <label>Configuration (Optional):</label>
          <div>
            <input 
              type="text" 
              placeholder="Key"
              value={configKey}
              onChange={(e) => setConfigKey(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Value"
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
            />
            <button type="button" onClick={handleAddConfig}>Add Configuration</button>
          </div>
          <div>
            {Object.keys(configuration).map((key) => (
              <p key={key}>{key}: {configuration[key]}</p>
            ))}
          </div>
        </div>
      )}
        

        <button type="submit">Create Policy</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreatePolicy;
