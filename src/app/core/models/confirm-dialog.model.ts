export interface ConfirmDialogModel {
	message: string;
	yesFunction: () => void;
	noFunction: () => void;
}
