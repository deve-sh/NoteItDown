import { Text, List, ListItem } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";

const ChildrenDocumentList = styled(List)`
	margin: 0 auto;
	margin-top: 2.5rem;
	min-width: 650px;
`;

const DocumentLink = styled(Link)`
	padding: calc(0.5 * var(--standard-spacing));
	width: 100%;
	display: block;
	&:hover {
		background: var(--backgroundgrey);
	}
`;

const DocumentsList = ({
	documents = [],
	updateDocumentsOrder = () => null,
	draggable = undefined,
}) => (
	<ChildrenDocumentList spacing="3">
		<ReactSortable
			list={documents}
			setList={updateDocumentsOrder}
			draggable={draggable}
			delayOnTouchStart
			delay={2}
			animation={200}
		>
			{documents
				.sort((doc1, doc2) =>
					"position" in doc1 && "position" in doc2
						? doc1.position - doc2.position
						: 0
				)
				.map((doc) => (
					<ListItem key={doc.id} className="draggable">
						<DocumentLink to={`/editor/document/${doc.id}`} target="_blank">
							<Text fontWeight="500">
								{doc.identifierEmoji?.emoji || "📄"} {doc.title}
							</Text>
						</DocumentLink>
					</ListItem>
				))}
		</ReactSortable>
	</ChildrenDocumentList>
);

export default DocumentsList;
