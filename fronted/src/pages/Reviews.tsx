import axios from 'axios';
import { useQuery } from 'react-query';
import { apiVersion } from '../utils';
import { Avatar, Divider, List, Skeleton } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
const Reviews = () => {
	// const result = useQuery({
	// 	queryKey: 'reviews',
	// 	queryFn: () => axios.get(`${apiVersion}/reviews`),
	// });
	const [loading, setLoading] = useState(false);
	let [page, setPage] = useState(1);
	const [data, setData] = useState<any[]>([]);

	const loadMoreData = () => {
		if (loading) {
			return;
		}
		setLoading(true);
		axios
			.get(`${apiVersion}/reviews?page=${page}&limit=10`)
			.then((res) => {
				setData([...data, ...res.data.data.result]);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		loadMoreData();
	}, [page]);
	return (
		<div
			id='scrollableDiv'
			style={{
				height: 600,
				overflow: 'auto',
				padding: '0 16px',
				// border: '1px solid rgba(140, 140, 140, 0.35)',
			}}
		>
			<InfiniteScroll
				dataLength={data.length}
				next={() => {
					console.log('here');
					setPage(++page);
				}}
				hasMore={data.length < 60}
				loader={
					<Skeleton
						avatar
						paragraph={{
							rows: 1,
						}}
						active
					/>
				}
				endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
				scrollableTarget='scrollableDiv'
			>
				<List
					dataSource={data}
					renderItem={(item) => (
						<List.Item key={item.email}>
							<List.Item.Meta
								avatar={<Avatar src={`/img/users/${item.user.photo}`} />}
								title={<a href='https://ant.design'>{item.user.name}</a>}
								description={item.review}
							/>
						</List.Item>
					)}
				/>
			</InfiniteScroll>
		</div>
	);
};

export default Reviews;
