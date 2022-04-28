import styled from "@emotion/styled";
import React from "react";

interface Props {
	title: string;
	children: React.ReactNode;
}

const Group = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 16px;
`;

const Filters = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
`;

export const FiltersGroup: React.FC<Props> = ({ title, children }) => {
	return (
		<Group>
			<span>{title}</span>
			<Filters>{children}</Filters>
		</Group>
	);
};
