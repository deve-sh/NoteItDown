import { Text, Box, List, ListItem, Button } from "@chakra-ui/react";
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
	deleteDocument = () => null,
	draggable = undefined,
	className = "",
	showDocumentOptions = true,
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
					<ListItem
						display="flex"
						alignItems="center"
						maxWidth="550px"
						key={doc.id}
						className="draggable"
					>
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
						{showDocumentOptions ? (
							<>
								<Link
									to={`/editor/new/${doc.workspace}?parentDocumentId=${doc.id}`}
									title="Create Nested Document"
									style={{ opacity: 0.5, marginLeft: "0.5rem" }}
									target="_blank"
									rel="noopener noreferrer"
								>
									➕
								</Link>
								{deleteDocument && (
									<Button
										variant="ghost"
										onClick={deleteDocument}
										colorScheme="blue"
										marginLeft="0.5rem"
										padding={0}
									>
										❌
									</Button>
								)}
							</>
						) : (
							""
						)}
					</ListItem>
				))}
		</ReactSortable>
	</ChildrenDocumentList>
);

export default DocumentsList;
