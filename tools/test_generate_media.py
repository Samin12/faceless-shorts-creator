import unittest
from generate_media import command, result_url


class MediaContract(unittest.TestCase):
    def test_cli_completed_job(self):
        self.assertEqual(result_url([{'status': 'completed', 'result_url': 'https://cdn.example/result.wav'}]), 'https://cdn.example/result.wav')

    def test_never_download_input_reference(self):
        self.assertIsNone(result_url({'params': {'image_references': [{'url': 'https://cdn.example/input.png'}]}}))

    def test_audio_has_no_video_flags(self):
        args = command('audio', 'Narration')
        self.assertEqual(args[3], 'seed_audio')
        self.assertNotIn('--duration', args)

    def test_video_preserves_reference_path_as_one_argument(self):
        args = command('video', 'A macro shot', '/tmp/path with spaces/image.png')
        self.assertEqual(args[args.index('--start-image') + 1], '/tmp/path with spaces/image.png')
        self.assertIn('--wait', args)


if __name__ == '__main__':
    unittest.main()
