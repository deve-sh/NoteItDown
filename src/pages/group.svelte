<script>
	import { Router, Route, Link } from "svelte-navigator";

	export let groupId;
</script>

<div class="GroupPage">
	<h2>Group Page</h2>

	<span>Viewing group/{groupId}</span>

	<Link to="../">Go back to the landing page</Link>

	<Router>
		<Route path=":id" let:params>
			<h2>ID: {params.id}</h2>
            Use the above param to get the group information, display list of users.
            Or redirect to 404 in case group is not found.
		</Route>
	</Router>
</div>
