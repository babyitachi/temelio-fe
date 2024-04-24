import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DataTable = ({ data }) => {

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nonprofit Legal Name
                        </TableCell>
                        <TableCell>Grant Submission Name
                        </TableCell>
                        <TableCell>Stage
                        </TableCell>
                        <TableCell>Foundation Owner
                        </TableCell>
                        <TableCell>Requested Amount
                        </TableCell>
                        <TableCell>Awarded Amount
                        </TableCell>
                        <TableCell>Grant Type
                        </TableCell>
                        <TableCell>Tags
                        </TableCell>
                        <TableCell>Duration Start

                        </TableCell>
                        <TableCell>Duration End

                        </TableCell>
                        {/* Add more table headers as needed */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.map((row) => (
                        <TableRow key={row.id}>

                            <TableCell>{row.NonprofitLegalName}
                            </TableCell>
                            <TableCell>{row.GrantSubmissionName}

                            </TableCell>
                            <TableCell>{row.Stage}

                            </TableCell>
                            <TableCell>{row.FoundationOwner}
                            </TableCell>
                            <TableCell>{row.RequestedAmount}
                            </TableCell>
                            <TableCell>{row.AwardedAmount}
                            </TableCell>
                            <TableCell>{row.GrantType}

                            </TableCell>
                            <TableCell>{row.Tags}

                            </TableCell>
                            <TableCell>{row.DurationStart}

                            </TableCell>
                            <TableCell>{row.DurationEnd}

                            </TableCell>
                            {/* Render other data cells here */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;
