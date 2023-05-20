import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

const DataTable = () => {
  const [data, setData] = useState(
    Array(50)
      .fill(0)
      .map((_, i) => {
        return {
          id: 1 + i,
          first_name: "Firstname" + i,
          last_name: "Lastname" + i,
          email: "px@gmail.com",
          last_login_at: "2023-02-16T19:23:41.107Z",
          total_score: 0,
          role: "user",
          employer: "Employer",
          top_3_tools: [
            {
              tool_name: "Tool",
              score: 1,
            },
          ],
          tools: [
            {
              tool_name: "Tool1",
              strategy: "ax",
              role: "l",
              category: "a",
              score: 1,
              rating: 1.1,
            },
            {
              tool_name: "Tool2",
              strategy: "ax",
              role: "l",
              category: "a",
              score: 1,
              rating: 1.1,
            },
          ],
        };
      })
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const borderStyle = { border: "1px solid #e0e0e0" };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "first_name", headerName: "First Name" },
    { field: "last_name", headerName: "Last name" },
    { field: "email", headerName: "Email" },
    {
      field: "last_login_at",
      headerName: "Last Login At",
      valueGetter: ({ value }) => {
        const date = new Date(value);
        return `At ${date.toLocaleTimeString()} on ${date.toLocaleDateString()}`;
      },
    },
    {
      field: "total_score",
      headerName: "Total Score",
    },
    {
      field: "role",
      headerName: "Role",
      valueGetter: ({ row }) => {
        let role = "User";

        if (row.company_admin) {
          role = "Company Admin";
        } else if (row.team_admin) {
          role = "Team Admin";
        }

        return role;
      },
    },
    {
      field: "employer",
      headerName: "Employer",
    },
    {
      field: "top_3_tools",
      headerName: "Top Tools",
      valueGetter: ({ value }) => {
        return value
          .map((tool) => `${tool.tool_name} : ${tool.score}`)
          .join(` \n`);
      },
    },
    {
      field: "tools",
      headerName: "Tools",
      colSpan: 6,
      align: "center",
      subcolumns: [
        {
          field: "tool_name",
          headerName: "Name",
        },
        {
          field: "strategy",
          headerName: "Strategy",
        },
        {
          field: "role",
          headerName: "Role",
          valueGetter: ({ value }) => {
            const roleMapping = {
              p: "Planner",
              a: "Analyst",
              u: "User",
              l: "Leader",
              i: "Technologist",
            };

            return roleMapping[value];
          },
        },
        {
          field: "category",
          headerName: "Category",
        },
        {
          field: "score",
          headerName: "Expertise",
        },
        {
          field: "rating",
          headerName: "Rating",
        },
      ],
    },
  ];

  const tools_columns = columns[columns.length - 1];
  const common = columns.slice(0, -1);

  function cellValue(column, row) {
    return column.valueGetter
      ? column.valueGetter({
          row,
          value: row[column.field],
        })
      : row[column.field];
  }

  return (
    <div style={{ padding: 15 }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 95 * 9 }}>
          <Table stickyHeader aria-label="sticky table" sx={borderStyle}>
            <TableHead>
              <TableRow>
                {columns.map((column, idx) => (
                  <TableCell
                    colSpan={column.colSpan}
                    align={column.align}
                    sx={{ ...borderStyle, fontWeight: "bold" }}
                    key={idx}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {Array(common.length)
                  .fill(0)
                  .map((_, i) => (
                    <TableCell key={i} style={{ zIndex: 0 }}></TableCell>
                  ))}

                {/* subcolumns */}
                {tools_columns.subcolumns.map((column, idx) => (
                  <TableCell
                    sx={{ ...borderStyle, fontWeight: "bold", zIndex: 0 }}
                    key={idx}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, idx) => (
                  <React.Fragment key={idx}>
                    <TableRow>
                      {common.map((column, idx) => (
                        <TableCell rowSpan={row.tools.length} key={idx}>
                          {cellValue(column, row)}
                        </TableCell>
                      ))}

                      {/* subcolumns first item */}
                      {row.tools.length > 0
                        ? tools_columns.subcolumns.map((column, idx) => (
                            <TableCell sx={borderStyle} key={idx}>
                              {cellValue(column, row.tools[0])}
                            </TableCell>
                          ))
                        : Array(6)
                            .fill(0)
                            .map((i) => <TableCell key={i}></TableCell>)}
                    </TableRow>

                    {/*  subcolumns items from index 1 */}
                    {row.tools.slice(1).map((tool, idx) => (
                      <TableRow key={idx}>
                        {tools_columns.subcolumns.map((column, idx) => (
                          <TableCell sx={borderStyle} key={idx}>
                            {cellValue(column, tool)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default DataTable;
