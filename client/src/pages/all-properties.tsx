import { Add } from "@mui/icons-material";
import { useTable } from "@refinedev/core";
import {
	Typography,
	Box,
	Stack,
	TextField,
	Select,
	MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PropertyCard, CustomButton } from "components";
import { useMemo } from "react";

const AllProperties = () => {
	const navigate = useNavigate();

	const {
		tableQueryResult: { data, isLoading, isError },
		current,
		setCurrent,
		setPageSize,
		pageCount,
		sorters,
		setSorters,
		filters,
		setFilters,
	} = useTable();
	console.log(data);

	const allProperties = data?.data ?? [];

	const currentPrice = sorters.find((item) => item.field === "price")?.order;

	const currentFilterValues = useMemo(() => {
		const logicalFilters = filters.flatMap((item) =>
			"field" in item ? item : []
		);
		return {
			title: logicalFilters.find((item) => item.field === "title")?.value,
		};
	}, [filters]);

	const toggleSort = (field: string) => {
		setSorters([{ field, order: currentPrice === "asc" ? "desc" : "asc" }]);
	};

	if (isLoading) return <Typography>Loading...</Typography>;
	if (isError) return <Typography>Error...</Typography>;

	return (
		<Box>
			<Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
				<Stack direction="column" width="100%">
					<Typography fontSize={25} fontWeight={700} color="#11142d">
						{!allProperties.length
							? "There are no properties"
							: "All properties"}
					</Typography>
					<Box
						mb={2}
						mt={3}
						display="flex"
						width="84%"
						justifyContent="space-between"
						flexWrap="wrap">
						<Box
							display="flex"
							gap={2}
							flexWrap="wrap"
							mb={{ sx: "20px", sm: 0 }}>
							<CustomButton
								title={`Sort price ${currentPrice === "asc" ? "↑" : "↓"}`}
								handleClick={() => toggleSort("price")}
								backgroundColor="#475be8"
								color="#fcfcfc"
							/>
							<TextField
								variant="outlined"
								color="info"
								placeholder="Search by title"
								value={currentFilterValues.title}
								onChange={(e) => {
									setFilters([
										{
											field: "title",
											operator: "contains",
											value: e.currentTarget.value
												? e.currentTarget.value
												: undefined,
										},
									]);
								}}
							/>
							<Select
								variant="outlined"
								color="info"
								displayEmpty
								required
								inputProps={{ "aria-label": "Without label" }}
								defaultValue=""
								value=""
								onChange={() => {}}>
								<MenuItem value="">All</MenuItem>
							</Select>
						</Box>
					</Box>
				</Stack>
			</Box>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<CustomButton
					title="Add Property"
					handleClick={() => navigate("/properties/create")}
					backgroundColor="#475be8"
					color="#fcfcfc"
					icon={<Add />}
				/>
			</Stack>
			<Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
				{allProperties.map((property) => (
					<PropertyCard
						key={property._id}
						id={property._id}
						title={property.title}
						price={property.price}
						location={property.location}
						photo={property.photo}
					/>
				))}
			</Box>
			{allProperties.length > 0 && (
				<Box display="flex" gap={2} mt={3} flexWrap="wrap">
					<CustomButton
						title="Previous"
						handleClick={() => setCurrent((prev) => prev - 1)}
						backgroundColor="#475be8"
						color="#fcfcfc"
						disabled={!(current > 1)}
					/>
					<Box
						display={{ sx: "hidden", sm: "flex" }}
						alignItems="center"
						gap="5px">
						Page{" "}
						<strong>
							{current} of {pageCount}
						</strong>
					</Box>
					<CustomButton
						title="Next"
						handleClick={() => setCurrent((prev) => prev + 1)}
						backgroundColor="#475be8"
						color="#fcfcfc"
						disabled={!(current == 1)}
					/>
					<Select
						variant="outlined"
						color="info"
						displayEmpty
						required
						inputProps={{ "aria-label": "Without label" }}
						defaultValue={10}
						value=""
						onChange={() => {}}>
						{[10, 20, 30, 40, 50].map((size) => (
							<MenuItem key={size} value={size}>
								Show {size}
							</MenuItem>
						))}
					</Select>
				</Box>
			)}
		</Box>
	);
};

export default AllProperties;
