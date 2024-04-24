import { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, FormControl, Input, InputLabel, MenuItem, OutlinedInput, Select, Tab, Tabs } from '@mui/material';
import DataTable from './NonProfitTable';

function OrganizationTabs() {
    const [foundations, setFoundations] = useState([]);
    const [nonprofits, setNonprofits] = useState([]);
    const [selectedNonprofits, setSelectedNonprofits] = useState([]);
    const [selectedNonprofitEmails, setSelectedNonprofitEmails] = useState({});
    const [senderEmail, setSenderEmail] = useState('');
    const [senderEmailCC, setSenderEmailCC] = useState('');
    const [senderEmailBCC, setSenderEmailBCC] = useState('');
    const [value, setValue] = useState(0);
    const [file, setFile] = useState(null);
    const [csvData, setCsvData] = useState(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        fetchNonprofits();
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleAddFoundation = async (event) => {
        event.preventDefault();
        const { email, name } = event.target.elements;
        try {
            await axios.post('/api/foundation/add', { email: email.value, name: name.value });
            setFoundations([...foundations, { email: email.value, name: name.value }]);
            alert("Foundation added succesfully")
        } catch (error) {
            alert('Error adding foundation', error);
        }
    };

    const handleAddNonprofit = async (event) => {
        event.preventDefault();
        const { email, name, address } = event.target.elements;
        try {
            await axios.post('/api/nonprofit/add', { email: email.value, name: name.value, address: address.value });
            setNonprofits([...nonprofits, email.value]);
            alert("Non Profit added succesfully")
        } catch (error) {
            alert('Error adding nonprofit', error);
        }
    };

    const handleSelectNonprofit = async (email) => {
        try {
            const response = await axios.get(`/api/email/get?nonProfitEmail=${email}`);
            setSelectedNonprofitEmails((prevEmails) => ({
                ...prevEmails,
                [email]: response.data || [],
            }));
        } catch (error) {
            alert('Error retrieving emails', error);
        }
    };
    const handleSendEmail = async () => {
        if (!selectedNonprofits.length || !senderEmail) return;
        try {
            const recipientEmails = selectedNonprofits;
            const resp = await axios.post('/api/email/send', { nonProfitEmailIds: recipientEmails, senderEmailId: senderEmail, senderEmailCCId: senderEmailCC, senderEmailBCCId: senderEmailBCC });
            if (resp.data == "NotReg") {
                alert('Foundation not registered!');
                return;
            }
            alert('Email sent successfully!');
        } catch (error) {
            alert('Error sending email', error);
        }
    };
    const fetchNonprofits = async () => {
        try {
            const response = await axios.get('/api/nonprofit/all');
            setNonprofits(response.data);
        } catch (error) {
            alert('Error fetching nonprofits', error);
        }
    };


    const handleUploadNpCSV = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/files/uploadNpCSV', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    console.log('CSV file uploaded successfully!');
                    alert('CSV file uploaded successfully!');
                } else {
                    console.error('Failed to upload CSV file');
                    alert('Failed to upload CSV file');
                }
            } catch (error) {
                console.error('Error uploading CSV file:', error);
                alert('Error uploading CSV file:' + error?.toString());
            }
        } else {
            alert('No File to upload!');

        }
    };

    const fetchNpCSVData = async () => {
        try {
            const response = await axios.get('/api/files/getNpCSVData',);
            setCsvData(response.data);
        } catch (error) {
            console.error('Error fetching  Np CSV data:', error);
        }
    };

    useEffect(() => {
        console.log('Selected Nonprofit Emails:', selectedNonprofitEmails);
    }), [selectedNonprofitEmails]


    return (
        <Box sx={{ width: '100%', background: "white" }}>
            <Tabs value={value} onChange={handleChange} sx={{ textDecorationColor: "black" }}>
                <Tab label="Foundation" sx={{ color: 'black' }} />
                <Tab label="Nonprofit" sx={{ color: 'black' }} />
            </Tabs>

            <TabPanel value={value} index={0}>
                <div className='flex flex-col gap-3'>
                    <form onSubmit={handleAddFoundation} className='gap-2 flex'>
                        <Input type="email" name="email" placeholder="Email" required className='p-2' />
                        <Input type="text" name="name" placeholder="Name" required className='p-2' />
                        <Button type="submit" color='primary' variant='contained' sx={{ font: "10px" }}>Add Foundation</Button>
                    </form>
                    <div className='flex gap-2'>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="select-placeholder">NonProfit</InputLabel>
                            <Select required multiple value={selectedNonprofits}
                                onChange={(e) => {
                                    const {
                                        target: { value },
                                    } = e;
                                    setSelectedNonprofits(
                                        typeof value === 'string' ? value.split(',') : value,
                                    );
                                }}
                                input={<OutlinedInput label="nonProfit" />}
                            >
                                {nonprofits.map((nonprofit) => (
                                    <MenuItem key={nonprofit} value={nonprofit}
                                    >
                                        {nonprofit}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Input required name="Sender email" placeholder="Sender email*" className='p-2' value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
                        <Input name="Sender CC email" placeholder="Sender CC email" className='p-2' value={senderEmailCC} onChange={(e) => setSenderEmailCC(e.target.value)} />
                        <Input name="Sender BCC email" placeholder="Sender BCC email" className='p-2' value={senderEmailBCC} onChange={(e) => setSenderEmailBCC(e.target.value)} />
                        <Button onClick={handleSendEmail} color='primary' variant='contained' sx={{ font: "10px" }}>Send Email</Button>
                    </div>
                </div>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <div className='flex flex-col gap-4'>
                    <form onSubmit={handleAddNonprofit} className='gap-2 flex'>
                        <Input type="email" name="email" placeholder="Email" required />
                        <Input type="text" name="name" placeholder="Name" required />
                        <Input type="text" name="address" placeholder="Address" required />
                        <Button type="submit" color='primary' variant='contained' sx={{ font: "10px" }}>Add Nonprofit</Button>
                    </form>
                    <div className='flex flex-col gap-1 my-2'>
                        <h2 className='text-black'>Upload NonProfit CSV</h2>
                        <p className='flex gap-2'>
                            <Input type='file' onChange={handleFileChange} placeholder='select .csv file' />
                            <Button onClick={handleUploadNpCSV} color='primary' variant='contained' sx={{ font: "10px" }}>Upload</Button>
                            <Button onClick={fetchNpCSVData} color='primary' variant='contained' sx={{ font: "10px" }}>fetch</Button>
                        </p>
                    </div>
                    {csvData && <DataTable data={csvData}></DataTable>}
                    {nonprofits.map((nonprofitEmail, index) => (
                        <Accordion key={index} onChange={() => { handleSelectNonprofit(nonprofitEmail) }}>
                            <AccordionSummary
                                id={index}
                            >
                                {nonprofitEmail}
                            </AccordionSummary>
                            <AccordionDetails
                                key={Object.keys(selectedNonprofitEmails).length}
                                id={index}>
                                {nonprofitEmail in selectedNonprofitEmails ? <div className='rounded-lg border-2'>
                                    {selectedNonprofitEmails[nonprofitEmail].length ? selectedNonprofitEmails[nonprofitEmail].map((email, index) => (
                                        <div className='text-[black]' key={index}>* {email}</div>
                                    )) : <div className='text-[black]'>No emails found</div>}
                                </div> : null}
                            </AccordionDetails>
                        </Accordion>
                    ))}

                </div>
            </TabPanel>
        </Box>
    );
}

export default OrganizationTabs;

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}