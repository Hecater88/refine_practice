import { useLogin } from "@refinedev/core";
import { useEffect, useRef } from "react";

import { Box, Container, Typography } from "@mui/material";
import { ThemedTitle } from "@refinedev/mui";

import { CredentialResponse } from "../interfaces/google";
import { yariga } from "../assets";

export const Login: React.FC = () => {
	const { mutate: login } = useLogin<CredentialResponse>();

	const GoogleButton = (): JSX.Element => {
		const divRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			if (typeof window === "undefined" || !window.google || !divRef.current) {
				return;
			}

			try {
				window.google.accounts.id.initialize({
					ux_mode: "popup",
					client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
					callback: async (res: CredentialResponse) => {
						if (res.credential) {
							login(res);
						}
					},
				});
				window.google.accounts.id.renderButton(divRef.current, {
					theme: "filled_blue",
					size: "medium",
					type: "standard",
				});
			} catch (error) {
				console.log(error);
			}
		}, []);

		return <div ref={divRef} />;
	};

	return (
		<Box component="div" sx={{ backgroundColor: "#FCFCFC" }}>
			<Container
				style={{
					height: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Box
					display="flex"
					gap="36px"
					justifyContent="center"
					flexDirection="column"
					alignItems="center">
					<div>
						<img src={yariga} alt="Refine Project Logo" />
					</div>
					<GoogleButton />
				</Box>
			</Container>
		</Box>
	);
};
