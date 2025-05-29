import React from 'react';
import { Table, Box } from '@chakra-ui/react';

type Header = {
  key: string;
  label: string;
};

type TableProps = {
  headers: Header[];
  data: Array<Record<string, string | number | boolean>>;
};

const DynamicTable: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <Box overflowX="auto" className="shadow-md rounded-lg border border-gray-200">
      <Table.Root variant="line" size="md" className="min-w-full">
        <Table.Header className="bg-gray-100">
            <Table.Row>
                {headers.map((header) => (
                <Table.ColumnHeader key={header.key} className="text-left px-4 py-2 font-semibold text-gray-700">
                    {header.label}
                </Table.ColumnHeader>
                ))}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {data.map((row, rowIndex) => (
                <Table.Row key={rowIndex} className="hover:bg-gray-50">
                {headers.map((header) => (
                    <Table.Cell key={`${rowIndex}-${header.key}`} className="px-4 py-2 text-sm text-gray-800">
                    {row[header.key]}
                    </Table.Cell>
                ))}
                </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default DynamicTable;
