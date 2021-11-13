import { Text, Box, List, ListItem } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";

const ChildrenDocumentList = styled(List)`
	margin: 0 auto;
	margin-top: 2.5rem;
	min-width: 650px;

	&.limitedwidth {
		max-width: 650px;
	}
`;

const DocumentLink = styled(Link)`
	padding: calc(0.5 * var(--standard-spacing));
	width: 100%;
	max-width: 500px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	&:hover {
		background: var(--backgroundgrey);
	}
`;

const DocumentsList = ({
	documents = [],
	updateDocumentsOrder = () => null,
	draggable = undefined,
	className = "",
	showDocumentOptions = false,
}) => (
	<ChildrenDocumentList spacing="3" className={className}>
		<ReactSortable
			list={documents}
			setList={updateDocumentsOrder}
			draggable={draggable}
			delayOnTouchStart
			delay={2}
			animation={200}
			disabled={!!!draggable}
		>
			{documents
				.sort((doc1, doc2) =>
					"position" in doc1 && "position" in doc2
						? doc1.position - doc2.position
						: 0
				)
				.map((doc) => (
					<ListItem maxWidth="500px" key={doc.id} className="draggable">
						<DocumentLink to={`/editor/document/${doc.id}`} target="_blank">
							<Text width="90%" fontWeight="500">
								{doc.identifierEmoji?.emoji || "📄"} {doc.title}
							</Text>
							{doc.childrenDocuments?.length > 0 && (
								<Box
									flex={1}
									textAlign="right"
									width="10%"
									title="This Document has more documents inside it"
								>
									🔗
								</Box>
							)}
						</DocumentLink>
					</ListItem>
				))}
		</ReactSortable>
	</ChildrenDocumentList>
);

export default DocumentsList;
