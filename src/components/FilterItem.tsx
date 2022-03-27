import styled from "@emotion/styled";
import { Button, Paper, Tooltip } from "@mui/material";
import React from "react";

interface Props {
	tooltip: string;
	icon?: React.ReactNode;
	backgroundColor?: string;
	onClick?: () => void;
}

const StyledPaper = styled(Button)`
	display: flex;
	width: 64px;
	height: 64px;
	padding: 8px;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
	background-color: #dfdfdf;
	color: #9c9c9c;
`;

export const FilterItem: React.FC<Props> = ({
	tooltip,
	backgroundColor,
	icon,
	onClick,
}) => {
	return (
		<Tooltip disableInteractive title={tooltip}>
			<StyledPaper onClick={onClick} style={{ backgroundColor }}>
				{icon && icon}
			</StyledPaper>
		</Tooltip>
	);
};
