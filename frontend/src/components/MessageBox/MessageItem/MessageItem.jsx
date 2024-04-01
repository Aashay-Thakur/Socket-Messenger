import { convertToFirebaseTimestamp } from "utilities/helperFunctions";
import { useSpring, animated } from "@react-spring/web";
import { Media } from "./Media/Media";
import styles from "./MessageItem.module.scss";

const MessageItem = ({ message, isFirst }) => {
	let date = message.sentAt ? convertToFirebaseTimestamp(message.sentAt).toDate() : new Date();
	let hour = ("0" + date.getHours()).slice(-2);
	let minute = ("0" + date.getMinutes()).slice(-2);

	const enterMessageAnim = useSpring({
		from: { opacity: 0, x: message.isUserSent ? 100 : -100 },
		to: { opacity: 1, x: 0 },
		config: { duration: 150 },
	});

	return (
		<animated.div
			style={enterMessageAnim}
			className={`${styles.row} ${message.isUserSent ? styles.right : styles.left}`}>
			<div className={`${styles.message} ${isFirst ? styles.isFirst : ""} z-depth-3 `}>
				{message.media && <Media media={message.media} styles={styles} />}
				{message.media?.type === "link" && message.media?.url ? (
					<a href={message.media.url} className={styles.contentAnchor} target="_blank" rel="noreferrer">
						<div className={styles.content}>{message.content}</div>
					</a>
				) : (
					<div className={styles.content}>{message.content}</div>
				)}
				<div className={styles.time}>
					{hour}:{minute}
				</div>
			</div>
		</animated.div>
	);
};

export { MessageItem };
