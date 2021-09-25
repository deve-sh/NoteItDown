<script>
	import { Router, Route } from "svelte-navigator";

	// Pages
	import HomePage from "./pages/home.svelte";
	import GroupPage from "./pages/group.svelte";
</script>

<Router>
	<Route path="group/*groupId" component={GroupPage} />

	<Route path="document/*documentId">
		Document Saved from a group shared will appear here. Independent of group
		routes since documents can also be public.
	</Route>

	<Route>
		<HomePage />
	</Route>
</Router>
