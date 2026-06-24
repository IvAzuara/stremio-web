// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { deepEqual } = require('fast-equals');
const { useCore } = require('stremio/core');
const { withCoreSuspender, useProfile, useToast } = require('stremio/common');

const SearchParamsHandler = () => {
    const core = useCore();
    const profile = useProfile();
    const toast = useToast();

    const [searchParams, setSearchParams] = React.useState({});

    const onLocationChange = () => {
        const { origin, hash, search } = window.location;
        const { searchParams } = new URL(`${origin}${hash.replace('#', '')}${search}`);

        setSearchParams((previousSearchParams) => {
            const currentSearchParams = Object.fromEntries(searchParams.entries());
            return deepEqual(previousSearchParams, currentSearchParams) ? previousSearchParams : currentSearchParams;
        });
    };

    React.useEffect(() => {
        const { streamingServerUrl } = searchParams;

        if (streamingServerUrl) {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        streamingServerUrl,
                    },
                },
            });
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'AddServerUrl',
                    args: streamingServerUrl,
                },
            });
            toast.show({
                type: 'success',
                title: `Using streaming server at ${streamingServerUrl}`,
                timeout: 4000,
            });
        }
    }, [searchParams]);

    React.useEffect(() => {
        if (typeof window !== 'undefined' && window.STREMIO_STREAMING_SERVER_URL) {
            const injectedUrl = window.STREMIO_STREAMING_SERVER_URL;
            const currentUrl = profile.settings.streamingServerUrl;
            
            const isLocalhost = !currentUrl || currentUrl.includes('127.0.0.1') || currentUrl.includes('localhost');
            const isOldTunnel = currentUrl && currentUrl.includes('.trycloudflare.com') && currentUrl !== injectedUrl;
            
            if (isLocalhost || isOldTunnel) {
                core.transport.dispatch({
                    action: 'Ctx',
                    args: {
                        action: 'UpdateSettings',
                        args: {
                            ...profile.settings,
                            streamingServerUrl: injectedUrl,
                        },
                    },
                });
                core.transport.dispatch({
                    action: 'Ctx',
                    args: {
                        action: 'AddServerUrl',
                        args: injectedUrl,
                    },
                });
                toast.show({
                    type: 'success',
                    title: 'Servidor de Streaming Remoto Conectado',
                    message: `URL: ${injectedUrl}`,
                    timeout: 4000,
                });
            }
        }
    }, [profile.settings.streamingServerUrl]);

    React.useEffect(() => {
        onLocationChange();
        window.addEventListener('hashchange', onLocationChange);
        return () => window.removeEventListener('hashchange', onLocationChange);
    }, []);

    return null;
};

module.exports = withCoreSuspender(SearchParamsHandler);
