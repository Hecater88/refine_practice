import { useList } from "@refinedev/core";
import {
	PieChart,
	PropertyReferrals,
	PropertyCard,
	TotalRevenue,
	TopAgent,
} from "components";
import { Typography, Box, Stack } from "@mui/material";

const Home = () => {
	return (
		<Box>
			<Typography fontSize={25} fontWeight={700} color="#11142D">
				Dashboard
			</Typography>

			<Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
				<PieChart
					title="Properties for Sale"
					value={684}
					series={[75, 25]}
					colors={["#275be8", "#c4e8ef"]}
				/>
				<PieChart
					title="Properties for Rent"
					value={550}
					series={[60, 40]}
					colors={["#275be8", "#c4e8ef"]}
				/>
				<PieChart
					title="Properties for Sale"
					value={5684}
					series={[75, 25]}
					colors={["#275be8", "#c4e8ef"]}
				/>
				<PieChart
					title="Properties for City"
					value={555}
					series={[75, 25]}
					colors={["#275be8", "#c4e8ef"]}
				/>
			</Box>

			<Stack
				mt="15px"
				width="100%"
				direction={{ xs: "column", lg: "row" }}
				gap={4}>
				<TotalRevenue />
				<PropertyReferrals />
			</Stack>
		</Box>
	);
};

export default Home;
