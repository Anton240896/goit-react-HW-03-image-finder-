import { Component } from 'react';

import { fetchRequestApi } from './Api/Api';
import toast, { Toaster } from 'react-hot-toast';

import { AppWrapper } from './Layout';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { SearchBarContainer } from './Searchbar/SearchBar';

//      /*======== STATE =========*/

export class App extends Component {
  state = {
    query: '',
    page: 1,
    images: [],
    totalHits: 0,
    loading: false,
    error: false,
  };

  //   /*======= QUERY SEARCHBAR ========*/

  handleSubmit = query => {
    this.setState({
      query: query,
      page: 1,
      images: [],
    });
  };
  //   /*=========== LOAD-MORE BUTTON + 1 PAGE =============*/

  handleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  //   /*======== HTTP REQUEST =========*/

  async componentDidUpdate(prevProps, prevState) {
    const stateQuery = this.state.query;
    const statePage = this.state.page;
    const prevStateQuery = prevState.query;
    const prevStatePage = prevState.page;
    const { page, query } = this.state;

    if (prevStateQuery !== stateQuery || prevStatePage !== statePage) {
      try {
        this.setState({ loading: true, error: false });
        toast.success(' Yes! We found images.');
        const responseData = await fetchRequestApi(page, query);
        this.setState(prevState => ({
          images: [...prevState.images, ...responseData.hits],
          counter: responseData.counter,
        }));
      } catch (error) {
        this.setState({ error: true });
        toast.error(' No! Sorry, no images found, please try again!');
        console.log('Error:', error);
      } finally {
        this.setState({ loading: false });
      }
    }
  }
  //   /*======== RENDER ========*/

  render() {
    const { images, loading, error } = this.state;

    return (
      <AppWrapper>
        <SearchBarContainer onSubmit={this.handleSubmit} />
        {loading && <Loader />}
        {error && toast.error(' No! Sorry, no images found, please try again!')}

        {images.length > 0 && <ImageGallery images={images} />}

        <Button onLoadMore={this.handleLoadMore}>Load more</Button>

        <Toaster position="top-right" />
      </AppWrapper>
    );
  }
}
