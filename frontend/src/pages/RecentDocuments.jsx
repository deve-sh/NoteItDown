/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import styled from "@emotion/styled";
import { List, ListItem, Text } from "@chakra-ui/react";

import { getRecentDocumentsFromWorkspaces } from "API/documents";
import toasts from "helpers/toasts";
import useStore from "hooks/useStore";

import ContentWrapper from "Wrappers/ContentWrapper";
import NoneFound from "components/NoneFound";
import { useRef } from "react/cjs/react.development";

const DocumentsListWrapper = styled(ContentWrapper)`
	max-width: 850px;
`;
const DocumentLink = styled(Link)`
	padding: calc(0.5 * var(--standard-spacing));
	width: 100%;
	display: block;
	&:hover {
		background: var(--backgroundgrey);
	}
`;

const RecentDocuments = () => {
	// Page to have all documents recently updated or created in workspaces user's subscribed to.
	const user = useStore((state) => state.user);
	const setLoading = useStore((store) => store.setLoading);

	const isFetching = useRef(false);
	const [recentDocuments, setRecentDocuments] = useState([]);

	useEffect(() => {
		if (!isFetching.current) {
			isFetching.current = true;
			setLoading(true);
			getRecentDocumentsFromWorkspaces(
				user?.workspaces || [],
				(err, documents) => {
					isFetching.current = false;
					setLoading(false);
					if (err) return toasts.generateError(err);
					return setRecentDocuments(documents);
				}
			);
		}
	}, []);

	return (
		<DocumentsListWrapper>
			<Helmet>
				<title>NoteItDown - Recent Documents</title>
			</Helmet>
			{recentDocuments?.length ? (
				<List spacing="3" textAlign="left" minWidth="650px" marginTop="2.5rem">
					{recentDocuments.map((doc) => (
						<ListItem key={doc.id}>
							<DocumentLink to={`/editor/document/${doc.id}`} target="_blank">
								<Text fontWeight="500">
									{doc.identifierEmoji?.emoji || "📄"} {doc.title}
								</Text>
							</DocumentLink>
						</ListItem>
					))}
				</List>
			) : (
				<NoneFound label="No Documents Found Recently." />
			)}
		</DocumentsListWrapper>
	);
};

export default RecentDocuments;
