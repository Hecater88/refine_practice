import {
	AuthBindings,
	Authenticated,
	GitHubBanner,
	Refine,
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
	ErrorComponent,
	notificationProvider,
	RefineSnackbarProvider,
	ThemedLayoutV2,
} from "@refinedev/mui";

import { CssBaseline, GlobalStyles } from "@mui/material";
import routerBindings, {
	CatchAllNavigate,
	NavigateToResource,
	UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios, { AxiosRequestConfig } from "axios";
import { CredentialResponse } from "interfaces/google";
import {
	BlogPostCreate,
	BlogPostEdit,
	BlogPostList,
	BlogPostShow,
} from "pages/blog-posts";
import {
	CategoryCreate,
	CategoryEdit,
	CategoryList,
	CategoryShow,
} from "pages/categories";
import {
	Login,
	Home,
	AllProperties,
	PropertyDetails,
	CreateProperty,
	EditProperty,
	Agents,
	AgentProfile,
	MyProfile,
} from "pages";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { parseJwt } from "utils/parse-jwt";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";

import {
	AccountCircleOutlined,
	ChatBubbleOutline,
	PeopleAltOutlined,
	StarOutlineRounded,
	VillaOutlined,
	DashboardRounded,
} from "@mui/icons-material";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
	const token = localStorage.getItem("token");
	if (request.headers) {
		request.headers["Authorization"] = `Bearer ${token}`;
	} else {
		request.headers = {
			Authorization: `Bearer ${token}`,
		};
	}

	return request;
});

function App() {
	const authProvider: AuthBindings = {
		login: async ({ credential }: CredentialResponse) => {
			const profileObj = credential ? parseJwt(credential) : null;
			//save user to MongoDB...
			if (profileObj) {
				const response = await fetch("http://localhost:8080/api/v1/users", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: profileObj.name,
						email: profileObj.email,
						avatar: profileObj.picture,
					}),
				});
				const data = await response.json();
				console.log(data);
				if (response.status === 200) {
					localStorage.setItem(
						"user",
						JSON.stringify({
							...profileObj,
							avatar: profileObj.picture,
							userid: data._id,
						})
					);
				} else {
					return Promise.reject();
				}
			}

			if (profileObj) {
				localStorage.setItem(
					"user",
					JSON.stringify({
						...profileObj,
						avatar: profileObj.picture,
					})
				);

				localStorage.setItem("token", `${credential}`);

				return {
					success: true,
					redirectTo: "/",
				};
			}

			return {
				success: false,
			};
		},
		logout: async () => {
			const token = localStorage.getItem("token");

			if (token && typeof window !== "undefined") {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				axios.defaults.headers.common = {};
				window.google?.accounts.id.revoke(token, () => {
					return {};
				});
			}

			return {
				success: true,
				redirectTo: "/login",
			};
		},
		onError: async (error) => {
			console.error(error);
			return { error };
		},
		check: async () => {
			const token = localStorage.getItem("token");

			if (token) {
				return {
					authenticated: true,
				};
			}

			return {
				authenticated: false,
				error: {
					message: "Check failed",
					name: "Token not found",
				},
				logout: true,
				redirectTo: "/login",
			};
		},
		getPermissions: async () => null,
		getIdentity: async () => {
			const user = localStorage.getItem("user");
			if (user) {
				return JSON.parse(user);
			}

			return null;
		},
	};

	return (
		<BrowserRouter>
			<GitHubBanner />
			<RefineKbarProvider>
				<ColorModeContextProvider>
					<CssBaseline />
					<GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
					<RefineSnackbarProvider>
						<Refine
							dataProvider={dataProvider("http://localhost:8080/api/v1")}
							notificationProvider={notificationProvider}
							routerProvider={routerBindings}
							authProvider={authProvider}
							resources={[
								{
									name: "dashboard",
									icon: <DashboardRounded />,
									list: "/dashboard",
									meta: { label: "Dashboard" },
								},
								{
									name: "properties",
									list: AllProperties,
									show: PropertyDetails,
									create: CreateProperty,
									edit: EditProperty,
									icon: <VillaOutlined />,
								},
								{
									name: "agents",
									list: Agents,
									create: "/categories/create",
									edit: "/categories/edit/:id",
									show: AgentProfile,
									meta: {
										canDelete: true,
									},
									icon: <PeopleAltOutlined />,
								},
								{
									name: "reviews",
									icon: <StarOutlineRounded />,
									list: Home,
									create: "/categories/create",
									edit: "/categories/edit/:id",
									show: "/categories/show/:id",
									meta: {
										canDelete: true,
									},
								},
								{
									name: "messages",
									icon: <ChatBubbleOutline />,
									list: Home,
									create: "/categories/create",
									edit: "/categories/edit/:id",
									show: "/categories/show/:id",
									meta: {
										canDelete: true,
									},
								},
								{
									name: "my-profile",
									icon: <AccountCircleOutlined />,
									list: MyProfile,
									create: "/categories/create",
									edit: "/categories/edit/:id",
									show: "/categories/show/:id",
									meta: {
										canDelete: true,
									},
								},
							]}
							options={{
								syncWithLocation: true,
								warnWhenUnsavedChanges: true,
							}}>
							<Routes>
								<Route
									element={
										<Authenticated fallback={<CatchAllNavigate to="/login" />}>
											<ThemedLayoutV2 Header={Header}>
												<Outlet />
											</ThemedLayoutV2>
										</Authenticated>
									}>
									<Route path="/dashboard" element={<Home />} />
									<Route path="/properties" element={<AllProperties />} />
									<Route
										path="/properties/create"
										element={<CreateProperty />}
									/>

									<Route path="/categories">
										<Route index element={<CategoryList />} />
										<Route path="create" element={<CategoryCreate />} />
										<Route path="edit/:id" element={<CategoryEdit />} />
										<Route path="show/:id" element={<CategoryShow />} />
									</Route>
								</Route>
								<Route
									element={
										<Authenticated fallback={<Outlet />}>
											<NavigateToResource />
										</Authenticated>
									}>
									<Route path="/login" element={<Login />} />
								</Route>
								<Route
									element={
										<Authenticated>
											<ThemedLayoutV2 Header={Header}>
												<Outlet />
											</ThemedLayoutV2>
										</Authenticated>
									}>
									<Route path="*" element={<ErrorComponent />} />
								</Route>
							</Routes>

							<RefineKbar />
							<UnsavedChangesNotifier />
						</Refine>
					</RefineSnackbarProvider>
				</ColorModeContextProvider>
			</RefineKbarProvider>
		</BrowserRouter>
	);
}

export default App;
